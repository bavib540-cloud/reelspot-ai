import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = Deno.env.get('SUPABASE_URL')!
const SUPA_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(SUPA_URL, SUPA_KEY)

function buildLocalIdeas(form: Record<string, any>) {
  const hooks = {
    Horror: ['A silent knock at the door you didn’t hear before.', 'A shadow passes behind the glass and never moves back.', 'The camera hears a whisper before the character does.'],
    Cinematic: ['A city skyline fades into a restless emotional close-up.', 'A single frame holds the whole story before the cut.', 'The sound drops before the reveal hits.'],
    Funny: ['Everything is normal until the camera catches the best fail.', 'The joke starts with one look and ends in chaos.', 'What looked like a setup became a perfect disaster.'],
    Mysterious: ['A forgotten object appears where it should never be.', 'Someone says your name before the shot even turns.', 'The frame feels wrong before you understand why.'],
    Emotional: ['A tiny ordinary detail becomes the whole memory.', 'The silence speaks louder than the dialogue.', 'The final shot stays on the face longer than the moment needs.'],
    Aesthetic: ['Every colour feels like it was waiting for this frame.', 'Motion is the mood, stillness is the message.', 'The place becomes the character before the person speaks.'],
    Educational: ['One detail changes the entire story in under ten seconds.', 'The real lesson is hidden inside the process.', 'A quick visual cue explains everything in a single frame.']
  }

  const titles = {
    Horror: ['The Last Knock', 'From Under the Door', 'No One Turned Around'],
    Cinematic: ['Afterglow', 'The Silence Before', 'Still Frame'],
    Funny: ['The Great Plan', 'The Wrong Angle', 'One Perfect Mistake'],
    Mysterious: ['Whispers in the Hall', 'The Missing Frame', 'The Door That Wasn’t There'],
    Emotional: ['The Smallest Goodbye', 'Held in the Moment', 'A Memory That Stayed'],
    Aesthetic: ['Colour in Motion', 'Glass and Light', 'A Quiet View'],
    Educational: ['One Trick, One Story', "What's Hidden in the Frame?", 'The Process in 30 Seconds']
  }

  const genre = form.genre || 'Cinematic'
  const hookList = hooks[genre] || hooks.Cinematic
  const titleList = titles[genre] || titles.Cinematic

  return Array.from({ length: 3 }, (_, idx) => ({
    title: titleList[idx % titleList.length],
    hook: hookList[idx % hookList.length],
    storyline: `A ${form.people}-person team films a ${form.duration}-second ${genre.toLowerCase()} sequence at ${form.location}. The scene opens with ${hookList[idx].toLowerCase()} The pacing builds using ${form.equipment} footage and a ${form.mood} mood, ending with a memorable final beat that makes the viewer want the next clip.`,
    locationCategory: form.location || 'Sample location',
    sound: form.mood || 'cinematic',
    camera: ['Slow push-in', 'Low-angle reveal', 'Wide establishing shot', 'Handheld close-up'][idx % 4],
    editing: ['Match cut on motion', 'Short tension rhythm', 'Text intrusion at the reveal', 'Cut on sound cue'][idx % 4],
    caption: `${genre} mood, ${form.language || 'Tamil'} energy`,
    hashtags: '#ReelSpotAI #ShortFormStory #CreatorLife'
  }))
}

serve(async (req) => {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 })

    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401 })

    const userId = userData.user.id
    const body = await req.json()

    // Secure credit deduction before generation
    const { data: rpcData, error: rpcErr } = await supabase.rpc('consume_credit', { p_user: userId })
    if (rpcErr) {
      console.error('consume_credit error', rpcErr)
      return new Response(JSON.stringify({ error: 'credit_check_failed' }), { status: 402 })
    }
    if (rpcData === false) {
      return new Response(JSON.stringify({ error: 'no_credits_left' }), { status: 402 })
    }

    const ideas = buildLocalIdeas(body)

    // If a real AI API key is configured, you can use it here instead of the local fallback.
    // This endpoint intentionally keeps secrets on the server and uses a graceful fallback when no API is configured.
    // Example: const { OPENAI_API_KEY } = Deno.env.get('OPENAI_API_KEY')

    return new Response(JSON.stringify({ ideas, message: 'Generated via server-side local fallback. Configure your AI provider and server keys to use remote generations.' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'server_error' }), { status: 500 })
  }
})
