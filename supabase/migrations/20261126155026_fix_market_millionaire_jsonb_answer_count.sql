-- Use portable JSONB key counting for answer totals.
-- PostgreSQL exposes jsonb_object_keys, not jsonb_object_length.

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

  select count(*)::integer
    into v_answered
  from jsonb_object_keys(coalesce(v_state->'answers', '{}'::jsonb)) as answers(answer_id);

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
  v_answered integer;
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

  select count(*)::integer
    into v_answered
  from jsonb_object_keys(coalesce(v_room->'answers', '{}'::jsonb)) as answers(answer_id);

  v_room := jsonb_set(v_room, '{answeredCount}', to_jsonb(v_answered), true);

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
