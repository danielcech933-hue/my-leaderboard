-- Deny direct Data API access to game tables and correct host room closure.
drop policy if exists mm_rooms_deny_direct_access on public.mm_rooms;
create policy mm_rooms_deny_direct_access on public.mm_rooms
  for all to anon, authenticated using (false) with check (false);

drop policy if exists mm_room_players_deny_direct_access on public.mm_room_players;
create policy mm_room_players_deny_direct_access on public.mm_room_players
  for all to anon, authenticated using (false) with check (false);

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

revoke all on function public.mm_leave_room(text, text, text) from public, anon, authenticated;
grant execute on function public.mm_leave_room(text, text, text) to anon, authenticated;
