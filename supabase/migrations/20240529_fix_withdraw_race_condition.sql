-- Atomic withdrawal function to prevent race conditions
-- Uses pg_try_advisory_xact_lock for mutual exclusion per user

create or replace function request_withdrawal(
  p_creator_id uuid,
  p_amount numeric,
  p_method text
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_total_earnings numeric;
  v_total_withdrawn numeric;
  v_available numeric;
  v_withdrawal_id bigint;
begin
  -- Acquire advisory lock for this user (prevents concurrent withdrawals)
  if not pg_try_advisory_xact_lock(hashtext('withdraw_' || p_creator_id::text)) then
    return jsonb_build_object('error', 'Ya hay una solicitud de retiro en proceso');
  end if;

  -- Calculate earnings atomically
  select coalesce(sum(creator_earnings::numeric), 0)
  into v_total_earnings
  from sales
  where creator_id = p_creator_id and payment_status = 'completed';

  -- Calculate already withdrawn atomically
  select coalesce(sum(amount::numeric), 0)
  into v_total_withdrawn
  from withdrawals
  where creator_id = p_creator_id and status in ('paid', 'approved', 'pending');

  v_available := v_total_earnings - v_total_withdrawn;

  if p_amount > v_available then
    return jsonb_build_object(
      'error', 'Saldo insuficiente. Disponible: $' || round(v_available, 2) || ' USD'
    );
  end if;

  -- Insert withdrawal atomically
  insert into withdrawals (creator_id, amount, method, status)
  values (p_creator_id, p_amount, p_method, 'pending')
  returning id into v_withdrawal_id;

  return jsonb_build_object('success', true, 'id', v_withdrawal_id, 'available', v_available);
end;
$$;
