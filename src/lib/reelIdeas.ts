export type ReelIdeaForm = {
  genre: string
  duration: number
  location: string
  people: number
  equipment: string
  mood: string
  language: string
}

export type ReelIdea = {
  title: string
  hook: string
  storyline: string
  locationCategory: string
  sound: string
  camera: string
  editing: string
  caption: string
  hashtags: string
}

const genreHooks: Record<string, string[]> = {
  Horror: ['A silent knock at the door you didn’t hear before.', 'A shadow passes behind the glass and never moves back.', 'The camera hears a whisper before the character does.'],
  Cinematic: ['A city skyline fades into a restless emotional close-up.', 'A single frame holds the whole story before the cut.', 'The sound drops before the reveal hits.'],
  Funny: ['Everything is normal until the camera catches the best fail.', 'The joke starts with one look and ends in chaos.', 'What looked like a setup became a perfect disaster.'],
  Mysterious: ['A forgotten object appears where it should never be.', 'Someone says your name before the shot even turns.', 'The frame feels wrong before you understand why.'],
  Emotional: ['A tiny ordinary detail becomes the whole memory.', 'The silence speaks louder than the dialogue.', 'The final shot stays on the face longer than the moment needs.'],
  Aesthetic: ['Every colour feels like it was waiting for this frame.', 'Motion is the mood, stillness is the message.', 'The place becomes the character before the person speaks.'],
  Educational: ['One detail changes the entire story in under ten seconds.', 'The real lesson is hidden inside the process.', 'A quick visual cue explains everything in a single frame.']
}

const conceptTitles: Record<string, string[]> = {
  Horror: ['The Last Knock', 'From Under the Door', 'No One Turned Around'],
  Cinematic: ['Afterglow', 'The Silence Before', 'Still Frame'],
  Funny: ['The Great Plan', 'The Wrong Angle', 'One Perfect Mistake'],
  Mysterious: ['Whispers in the Hall', 'The Missing Frame', 'The Door That Wasn’t There'],
  Emotional: ['The Smallest Goodbye', 'Held in the Moment', 'A Memory That Stayed'],
  Aesthetic: ['Colour in Motion', 'Glass and Light', 'A Quiet View'],
  Educational: ['One Trick, One Story', "What's Hidden in the Frame?", 'The Process in 30 Seconds']
}

const locationMap: Record<string, string> = {
  'Marina Beach Access': 'Beaches and waterfronts',
  'Rose Garden Walk': 'Gardens and parks',
  'Heritage Courtyard': 'Historic architecture',
  'Street Art Lane': 'Colorful walls and street art',
  'Forest Pond Path': 'Forests and nature',
  'Authorized Rooftop Terrace': 'Rooftop-style scenery where access is authorized'
}

const moodSound: Record<string, string> = {
  scary: 'Low drone + soft wind + distant metallic rattle',
  cinematic: 'Wide ambient strings + soft low percussion',
  funny: 'Punchy foley + light rhythmic beat',
  mysterious: 'Sub-bass + subtle suspense textures',
  emotional: 'Gentle piano + breathy pad',
  aesthetic: 'Dreamy synth + soft percussion',
  educational: 'Clean natural sound + light rhythmic cue'
}

export function buildLocalIdeas(form: ReelIdeaForm): ReelIdea[] {
  return Array.from({ length: 3 }, (_, idx) => {
    const genre = form.genre || 'Cinematic'
    const hookList = genreHooks[genre] || genreHooks.Cinematic
    const titleList = conceptTitles[genre] || conceptTitles.Cinematic
    const hook = hookList[idx % hookList.length]
    const title = titleList[idx % titleList.length]

    const storyline = `A ${form.people}-person team films a ${form.duration}-second ${form.genre.toLowerCase()} sequence at ${form.location}. The scene opens with ${hook.toLowerCase()} The pacing builds using ${form.equipment} footage and a ${form.mood} mood, ending with a memorable final beat that makes the viewer want the next clip.`

    return {
      title,
      hook,
      storyline,
      locationCategory: locationMap[form.location] || form.location,
      sound: moodSound[form.mood] || moodSound.cinematic,
      camera: ['Slow push-in', 'Low-angle reveal', 'Wide establishing shot', 'Handheld close-up'][idx % 4],
      editing: ['Match cut on motion', 'Short tension rhythm', 'Text intrusion at the reveal', 'Cut on sound cue'][idx % 4],
      caption: [`${form.genre} mood, ${form.language} energy`, `Watch this full shot`, `Mini-story, major impact`][idx % 3],
      hashtags: ['#ReelSpotAI', '#ShortFormStory', '#CreatorLife', '#Filmmaking', '#UrbanVisuals', '#Storytelling'][idx % 6]
    }
  })
}

export async function generateReelIdeas(form: ReelIdeaForm, accessToken?: string): Promise<{ ideas: ReelIdea[]; source: 'local' | 'server'; message?: string }> {
  const apiUrl = import.meta.env.VITE_REEL_IDEAS_API_URL as string | undefined

  if (apiUrl) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Server generation failed')
      }

      const data = await res.json()
      if (Array.isArray(data.ideas) && data.ideas.length) {
        return { ideas: data.ideas as ReelIdea[], source: 'server', message: data.message }
      }
      throw new Error('No valid results returned by server endpoint')
    } catch (err) {
      console.warn('Server generation failed, falling back to local generation:', err)
      return { ideas: buildLocalIdeas(form), source: 'local', message: 'AI API not configured or credit limit reached. Showing a local generator fallback.' }
    }
  }

  return { ideas: buildLocalIdeas(form), source: 'local', message: 'No server AI endpoint configured. Showing a local generator fallback. Add VITE_REEL_IDEAS_API_URL and server-side keys to enable remote AI generation.' }
}
