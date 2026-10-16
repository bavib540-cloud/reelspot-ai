import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = Deno.env.get('SUPABASE_URL')!
const SUPA_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(SUPA_URL, SUPA_KEY)

serve(async (req) => {
  try {
    // Authenticate caller via Authorization: Bearer <access_token>
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 })

    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401 })
    const callerId = userData.user.id

    // Check profiles.is_admin
    const { data: profiles, error: profileErr } = await supabase.from('profiles').select('is_admin').eq('id', callerId).limit(1)
    if (profileErr) {
      console.error('profile lookup error', profileErr)
      return new Response(JSON.stringify({ error: 'profile_lookup_failed' }), { status: 500 })
    }
    const isAdmin = profiles?.[0]?.is_admin
    if (!isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 })

    const body = await req.json()
    const { payment_id, plan } = body
    if (!payment_id || !plan) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 })

    // Find payment
    const { data: payments } = await supabase.from('payments').select('*').eq('id', payment_id).limit(1)
    const payment = payments?.[0]
    if (!payment) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 })

    // Mark payment verified
    await supabase.from('payments').update({ status: 'verified', verified_by: callerId, verified_at: new Date().toISOString() }).eq('id', payment_id)

    // Determine allowance from plan
    const allowances: Record<string, number> = { creator_pro: 20, creator_plus: 50, free: 2 }
    const allowance = allowances[plan] ?? 0

    // Upsert subscription
    const ends = new Date()
    ends.setMonth(ends.getMonth() + 1)

    await supabase.from('subscriptions').upsert({ user_id: payment.user_id, plan, status: 'active', started_at: new Date().toISOString(), ends_at: ends.toISOString(), monthly_allowance: allowance, remaining_credits: allowance }, { onConflict: 'user_id' })

    // Grant credits in audit
    await supabase.from('generation_credits').insert([{ user_id: payment.user_id, change: allowance, reason: `Grant for plan ${plan}` }])

    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'server_error' }), { status: 500 })
  }
})
