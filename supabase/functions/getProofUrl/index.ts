import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = Deno.env.get('SUPABASE_URL')!
const SUPA_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(SUPA_URL, SUPA_KEY)

serve(async (req) => {
  try {
    const body = await req.json()
    const { proof_path } = body
    if (!proof_path) return new Response(JSON.stringify({ error: 'missing_proof_path' }), { status: 400 })

    const bucket = 'payment-proofs'
    // createSignedUrl is available server-side to produce a time-limited URL
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(proof_path, 60)
    if (error) {
      console.error('signed-url-err', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ signedUrl: data.signedUrl }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'server_error' }), { status: 500 })
  }
})
