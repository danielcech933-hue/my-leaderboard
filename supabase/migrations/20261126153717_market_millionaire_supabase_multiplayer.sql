-- Market Millionaire multiplayer schema and RPC API.
-- The browser only receives a publishable key. All game state mutations go
-- through SECURITY DEFINER functions that validate per-player capability tokens.

create table if not exists public.mm_rooms (
  code text primary key check (code ~ '^[A-Z0-9]{8}$'),
  host_player_id text not null default 'host',
  room_state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '6 hours')
);

create table if not exists public.mm_room_players (
  room_code text not null references public.mm_rooms(code) on delete cascade,
  player_id text not null,
  display_name text not null check (char_length(display_name) between 1 and 18),
  token_hash bytea not null,
  is_host boolean not null default false,
  online boolean not null default true,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (room_code, player_id)
);

create unique index if not exists mm_room_players_unique_name
  on public.mm_room_players (room_code, lower(display_name));
create index if not exists mm_rooms_expiry_idx on public.mm_rooms (expires_at);

alter table public.mm_rooms enable row level security;
alter table public.mm_room_players enable row level security;
revoke all on table public.mm_rooms from anon, authenticated;
revoke all on table public.mm_room_players from anon, authenticated;

create or replace function public.mm_personal_snapshot(p_code text, p_player_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_state jsonb;
  v_is_host boolean;
  v_answered integer;
begin
  select r.room_state, p.is_host
    into v_state, v_is_host
  from public.mm_rooms r
  join public.mm_room_players p on p.room_code = r.code
  where r.code = p_code and p.player_id = p_player_id;

  if not found then
    return null;
  end if;

  v_answered := jsonb_object_length(coalesce(v_state->'answers', '{}'::jsonb));

  if not v_is_host then
    v_state := jsonb_set(
      v_state,
      '{answers}',
      case
        when coalesce(v_state->'answers', '{}'::jsonb) ? p_player_id
          then jsonb_build_object(p_player_id, v_state->'answers'->p_player_id)
        else '{}'::jsonb
      end,
      true
    );
  end if;

  v_state := jsonb_set(v_state, '{answeredCount}', to_jsonb(v_answered), true);
  return v_state;
end;
$function$;

create or replace function public.mm_broadcast_room(p_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_player record;
  v_snapshot jsonb;
begin
  for v_player in
    select player_id, token_hash
    from public.mm_room_players
    where room_code = p_code and online = true
  loop
    v_snapshot := public.mm_personal_snapshot(p_code, v_player.player_id);
    if v_snapshot is not null then
      perform realtime.send(
        jsonb_build_object('type', 'state', 'room', v_snapshot),
        'state',
        'mm:' || p_code || ':' || encode(v_player.token_hash, 'hex'),
        false
      );
    end if;
  end loop;
end;
$function$;

create or replace function public.mm_create_room(
  p_code text,
  p_player_id text,
  p_token text,
  p_name text,
  p_room jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_hash bytea;
begin
  if p_code !~ '^[A-Z0-9]{8}$' then
    raise exception 'Neplatný kód místnosti.';
  end if;
  if p_player_id <> 'host' then
    raise exception 'Neplatná identita hostitele.';
  end if;
  if p_token is null or char_length(p_token) < 40 then
    raise exception 'Neplatný bezpečnostní token.';
  end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 18 then
    raise exception 'Přezdívka musí mít 1 až 18 znaků.';
  end if;
  if jsonb_typeof(p_room) <> 'object'
     or p_room->>'code' <> p_code
     or p_room->>'host' <> p_player_id
     or p_room->>'state' <> 'lobby'
     or jsonb_typeof(p_room->'players') <> 'array' then
    raise exception 'Neplatná data nové místnosti.';
  end if;

  v_hash := extensions.digest(convert_to(p_token, 'UTF8'), 'sha256');

  insert into public.mm_rooms(code, host_player_id, room_state)
  values (p_code, p_player_id, p_room);

  insert into public.mm_room_players(room_code, player_id, display_name, token_hash, is_host)
  values (p_code, p_player_id, btrim(p_name), v_hash, true);

  return public.mm_personal_snapshot(p_code, p_player_id);
end;
$function$;

create or replace function public.mm_join_room(
  p_code text,
  p_player_id text,
  p_token text,
  p_name text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_state jsonb;
  v_hash bytea;
  v_existing public.mm_room_players%rowtype;
  v_has_player boolean := false;
  v_players jsonb;
  v_online boolean;
begin
  if p_code !~ '^[A-Z0-9]{8}$' then
    raise exception 'Neplatný kód místnosti.';
  end if;
  if p_player_id is null or char_length(p_player_id) < 8 or char_length(p_player_id) > 128 then
    raise exception 'Neplatná identita hráče.';
  end if;
  if p_token is null or char_length(p_token) < 40 then
    raise exception 'Neplatný bezpečnostní token.';
  end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 18 then
    raise exception 'Přezdívka musí mít 1 až 18 znaků.';
  end if;

  v_hash := extensions.digest(convert_to(p_token, 'UTF8'), 'sha256');

  select room_state into v_state
  from public.mm_rooms
  where code = p_code and expires_at > now()
  for update;

  if not found then
    raise exception 'Místnost nebyla nalezena nebo její platnost vypršela.';
  end if;

  select * into v_existing
  from public.mm_room_players
  where room_code = p_code and player_id = p_player_id;

  v_has_player := found;

  if v_has_player then
    if v_existing.token_hash <> v_hash then
      raise exception 'Bezpečnostní token hráče nesouhlasí. Zkus se připojit znovu.';
    end if;
  else
    if v_state->>'state' <> 'lobby' then
      raise exception 'Tato hra už začala. Noví hráči se mohou připojit pouze do lobby.';
    end if;

    if (select count(*) from public.mm_room_players where room_code = p_code) >= 9 then
      raise exception 'Místnost je plná (maximálně 9 hráčů).';
    end if;
  end if;

  if exists (
    select 1
    from public.mm_room_players
    where room_code = p_code
      and player_id <> p_player_id
      and lower(display_name) = lower(btrim(p_name))
  ) then
    raise exception 'Tato přezdívka už v místnosti je.';
  end if;

  if v_has_player then
    update public.mm_room_players
      set display_name = btrim(p_name), online = true, last_seen_at = now()
    where room_code = p_code and player_id = p_player_id;
  else
    insert into public.mm_room_players(room_code, player_id, display_name, token_hash, is_host, online)
    values (p_code, p_player_id, btrim(p_name), v_hash, false, true);
  end if;

  select coalesce(
    jsonb_agg(
      case
        when item.value->>'id' = p_player_id
          then item.value || jsonb_build_object('peerId', 'supabase', 'name', btrim(p_name), 'online', true)
        else item.value
      end
      order by item.ordinality
    ),
    '[]'::jsonb
  )
  into v_players
  from jsonb_array_elements(coalesce(v_state->'players', '[]'::jsonb))
    with ordinality as item(value, ordinality);

  if not exists (
    select 1 from jsonb_array_elements(v_players) item(value)
    where item.value->>'id' = p_player_id
  ) then
    v_players := v_players || jsonb_build_array(jsonb_build_object(
      'id', p_player_id,
      'peerId', 'supabase',
      'name', btrim(p_name),
      'score', 0,
      'level', -1,
      'correct', 0,
      'elapsed', 0,
      'online', true,
      'lifelines', '[]'::jsonb,
      'secondReady', false,
      'secondRetryUsed', false
    ));
  end if;

  update public.mm_rooms
    set room_state = jsonb_set(v_state, '{players}', v_players, true),
        updated_at = now()
  where code = p_code;

  perform public.mm_broadcast_room(p_code);
  return public.mm_personal_snapshot(p_code, p_player_id);
end;
$function$;

create or replace function public.mm_get_room(
  p_code text,
  p_player_id text,
  p_token text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_snapshot jsonb;
  v_hash bytea;
begin
  if p_token is null then
    raise exception 'Chybí bezpečnostní token hráče.';
  end if;
  v_hash := extensions.digest(convert_to(p_token, 'UTF8'), 'sha256');

  if not exists (
    select 1 from public.mm_room_players
    where room_code = p_code
      and player_id = p_player_id
      and token_hash = v_hash
  ) then
    raise exception 'Nemáš oprávnění k této místnosti.';
  end if;

  update public.mm_room_players
    set online = true, last_seen_at = now()
  where room_code = p_code and player_id = p_player_id;

  v_snapshot := public.mm_personal_snapshot(p_code, p_player_id);
  if v_snapshot is null then
    raise exception 'Místnost už neexistuje.';
  end if;
  return v_snapshot;
end;
$function$;

create or replace function public.mm_host_update_room(
  p_code text,
  p_player_id text,
  p_token text,
  p_room jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_hash bytea;
  v_players jsonb;
  v_room jsonb;
begin
  if p_token is null then
    raise exception 'Chybí bezpečnostní token hostitele.';
  end if;
  if jsonb_typeof(p_room) <> 'object' or p_room->>'code' <> p_code then
    raise exception 'Neplatná data herní místnosti.';
  end if;

  v_hash := extensions.digest(convert_to(p_token, 'UTF8'), 'sha256');

  if not exists (
    select 1 from public.mm_room_players
    where room_code = p_code
      and player_id = p_player_id
      and is_host = true
      and token_hash = v_hash
  ) then
    raise exception 'Pouze ověřený hostitel může měnit stav hry.';
  end if;

  select coalesce(
    jsonb_agg(
      (
        coalesce(
          (
            select item.value
            from jsonb_array_elements(coalesce(p_room->'players', '[]'::jsonb)) item(value)
            where item.value->>'id' = p.player_id
            limit 1
          ),
          jsonb_build_object(
            'id', p.player_id,
            'score', 0,
            'level', -1,
            'correct', 0,
            'elapsed', 0,
            'lifelines', '[]'::jsonb,
            'secondReady', false,
            'secondRetryUsed', false
          )
        )
        || jsonb_build_object(
          'id', p.player_id,
          'peerId', 'supabase',
          'name', p.display_name,
          'online', p.online
        )
      )
      order by p.joined_at
    ),
    '[]'::jsonb
  )
  into v_players
  from public.mm_room_players p
  where p.room_code = p_code;

  v_room := jsonb_set(p_room, '{players}', v_players, true);
  v_room := jsonb_set(
    v_room,
    '{answeredCount}',
    to_jsonb(jsonb_object_length(coalesce(v_room->'answers', '{}'::jsonb))),
    true
  );

  update public.mm_rooms
    set room_state = v_room, updated_at = now()
  where code = p_code;

  if not found then
    raise exception 'Místnost už neexistuje.';
  end if;

  update public.mm_room_players
    set last_seen_at = now()
  where room_code = p_code and player_id = p_player_id;

  perform public.mm_broadcast_room(p_code);
  return public.mm_personal_snapshot(p_code, p_player_id);
end;
$function$;

create or replace function public.mm_submit_action(
  p_code text,
  p_player_id text,
  p_token text,
  p_action jsonb
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_hash bytea;
  v_state jsonb;
  v_host_hash bytea;
  v_action_type text;
begin
  if p_token is null or jsonb_typeof(p_action) <> 'object' then
    raise exception 'Neplatný požadavek.';
  end if;

  v_hash := extensions.digest(convert_to(p_token, 'UTF8'), 'sha256');

  if not exists (
    select 1 from public.mm_room_players
    where room_code = p_code
      and player_id = p_player_id
      and is_host = false
      and token_hash = v_hash
  ) then
    raise exception 'Nemáš oprávnění posílat akce do této místnosti.';
  end if;

  select room_state into v_state
  from public.mm_rooms
  where code = p_code and expires_at > now()
  for update;

  if not found or v_state->>'state' <> 'question'
     or (v_state->>'deadline')::numeric <= extract(epoch from clock_timestamp()) * 1000 then
    raise exception 'Čas na odpověď už vypršel.';
  end if;

  v_action_type := p_action->>'type';

  if v_action_type = 'answer' then
    if coalesce(p_action->>'answer', '') !~ '^[0-3]$' then
      raise exception 'Neplatná odpověď.';
    end if;
    if coalesce(v_state->'answers', '{}'::jsonb) ? p_player_id then
      raise exception 'Odpověď už byla odeslána.';
    end if;
  elsif v_action_type = 'lifeline' then
    if p_action->>'lifeline' not in ('fifty', 'hint', 'second') then
      raise exception 'Neplatný žolík.';
    end if;
  else
    raise exception 'Neznámá herní akce.';
  end if;

  select token_hash into v_host_hash
  from public.mm_room_players
  where room_code = p_code and is_host = true
  limit 1;

  if v_host_hash is null then
    raise exception 'Hostitel už není dostupný.';
  end if;

  perform realtime.send(
    jsonb_build_object(
      'type', 'action',
      'playerId', p_player_id,
      'action', p_action
    ),
    'action',
    'mm:' || p_code || ':' || encode(v_host_hash, 'hex'),
    false
  );

  update public.mm_room_players
    set last_seen_at = now()
  where room_code = p_code and player_id = p_player_id;

  return true;
end;
$function$;

create or replace function public.mm_leave_room(
  p_code text,
  p_player_id text,
  p_token text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_hash bytea;
  v_is_host boolean;
  v_players jsonb;
  v_player record;
begin
  if p_token is null then
    raise exception 'Chybí bezpečnostní token hráče.';
  end if;
  v_hash := extensions.digest(convert_to(p_token, 'UTF8'), 'sha256');

  select is_host into v_is_host
  from public.mm_room_players
  where room_code = p_code and player_id = p_player_id and token_hash = v_hash;

  if not found then
    return false;
  end if;

  if v_is_host then
    for v_player in
      select token_hash
      from public.mm_room_players
      where room_code = p_code
    loop
      perform realtime.send(
        jsonb_build_object('type', 'closed', 'message', 'Hostitel ukončil místnost.'),
        'closed',
        'mm:' || p_code || ':' || encode(v_player.token_hash, 'hex'),
        false
      );
    end loop;
    delete from public.mm_rooms where code = p_code;
    return true;
  end if;

  update public.mm_room_players
    set online = false
  where room_code = p_code and player_id = p_player_id;

  select coalesce(
    jsonb_agg(
      case
        when item.value->>'id' = p_player_id
          then item.value || jsonb_build_object('online', false)
        else item.value
      end
      order by item.ordinality
    ),
    '[]'::jsonb
  )
  into v_players
  from public.mm_rooms r,
       jsonb_array_elements(coalesce(r.room_state->'players', '[]'::jsonb))
         with ordinality as item(value, ordinality)
  where r.code = p_code;

  update public.mm_rooms
    set room_state = jsonb_set(room_state, '{players}', v_players, true),
        updated_at = now()
  where code = p_code;

  perform public.mm_broadcast_room(p_code);
  return true;
end;
$function$;

-- Internal helper RPCs must not be callable directly by browser roles.
revoke all on function public.mm_personal_snapshot(text, text) from public, anon, authenticated;
revoke all on function public.mm_broadcast_room(text) from public, anon, authenticated;

-- Browser roles may only call these token-validated entry points.
revoke all on function public.mm_create_room(text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.mm_join_room(text, text, text, text) from public, anon, authenticated;
revoke all on function public.mm_get_room(text, text, text) from public, anon, authenticated;
revoke all on function public.mm_host_update_room(text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.mm_submit_action(text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.mm_leave_room(text, text, text) from public, anon, authenticated;

grant execute on function public.mm_create_room(text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.mm_join_room(text, text, text, text) to anon, authenticated;
grant execute on function public.mm_get_room(text, text, text) to anon, authenticated;
grant execute on function public.mm_host_update_room(text, text, text, jsonb) to anon, authenticated;
grant execute on function public.mm_submit_action(text, text, text, jsonb) to anon, authenticated;
grant execute on function public.mm_leave_room(text, text, text) to anon, authenticated;
