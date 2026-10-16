-- Atomic RPC to consume one generation credit for a user.
-- Usage: select consume_credit('<user_uuid>'); returns boolean true if consumed, false if insufficient credits.

create or replace function consume_credit(p_user uuid) returns boolean as $$
declare
  _rem int;
begin
  select remaining_credits into _rem from subscriptions where user_id = p_user for update;
  if not found then
    return false;
  end if;
  if _rem > 0 then
    update subscriptions set remaining_credits = remaining_credits - 1 where user_id = p_user;
    insert into generation_credits(user_id, change, reason) values (p_user, -1, 'AI generation');
    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql;
