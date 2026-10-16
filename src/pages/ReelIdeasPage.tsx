import React, { useMemo, useState } from 'react'

const LANGUAGES = ['Tamil', 'English', 'Hindi', 'Kannada']
const GENRES = ['Horror', 'Cinematic', 'Funny', 'Mysterious', 'Emotional', 'Aesthetic', 'Educational']
const DURATIONS = [15, 30, 45, 60]
const MOODS = ['scary', 'cinematic', 'funny', 'mysterious', 'emotional', 'aesthetic', 'educational']

type IdeaForm = {
  genre: string
  duration: number
  location: string
  people: number
  equipment: string
  mood: string
  language: string
}

const defaultForm: IdeaForm = {
  genre: 'Horror',
  duration: 30,
  location: 'Marina Beach Access',
  people: 2,
  equipment: 'phone only',
  mood: 'scary',
  language: 'Tamil'
}

function createIdea(form: IdeaForm, index: number) {
  const hooks = {
    Horror: ['A silent knock at the door you didn’t hear before.', 'A shadow passes behind the glass and never moves back.', 'The camera hears a whisper before the character does.'],
    Cinematic: ['A city skyline fades into a restless emotional close-up.', 'A single frame holds the whole story before the cut.', 'The sound drops before the reveal hits.'],
    Funny: ['Everything is normal until the camera catches the best fail.', 'The joke starts with one look and ends in chaos.', 'What looked like a setup became a perfect disaster.'],
    Mysterious: ['A forgotten object appears where it should never be.', 'Someone says your name before the shot even turns.', 'The frame feels wrong before you understand why.'],
    Emotional: ['A tiny ordinary detail becomes the whole memory.', 'The silence speaks louder than the dialogue.', 'The final shot stays on the face longer than the moment needs.'],
    Aesthetic: ['Every colour feels like it was waiting for this frame.', 'Motion is the mood, stillness is the message.', 'The place becomes the character before the person speaks.'],
    Educational: ['One detail changes the entire story in under ten seconds.', 'The real lesson is hidden inside the process.', 'A quick visual cue explains everything in a single frame.']
  }

  const conceptTitles = {
    Horror: ['The Last Knock', 'From Under the Door', 'No One Turned Around'],
    Cinematic: ['Afterglow', 'The Silence Before', 'Still Frame'],
    Funny: ['The Great Plan', 'The Wrong Angle', 'One Perfect Mistake'],
    Mysterious: ['Whispers in the Hall', 'The Missing Frame', 'The Door That Wasn’t There'],
    Emotional: ['The Smallest Goodbye', 'Held in the Moment', 'A Memory That Stayed'],
    Aesthetic: ['Colour in Motion', 'Glass and Light', 'A Quiet View'],
    Educational: ['One Trick, One Story', 'What's Hidden in the Frame?', 'The Process in 30 Seconds']
  }

  const locationMap = {
    'Marina Beach Access': 'Beaches and waterfronts',
    'Rose Garden Walk': 'Gardens and parks',
    'Heritage Courtyard': 'Historic architecture',
    'Street Art Lane': 'Colorful walls and street art',
    'Forest Pond Path': 'Forests and nature',
    'Authorized Rooftop Terrace': 'Rooftop-style scenery where access is authorized'
  }

  const moodSound = {
    scary: 'Low drone + soft wind + distant metallic rattle',
    cinematic: 'Wide ambient strings + soft low percussion',
    funny: 'Punchy foley + light rhythmic beat',
    mysterious: 'Sub-bass + subtle suspense textures',
    emotional: 'Gentle piano + breathy pad',
    aesthetic: 'Dreamy synth + soft percussion',
    educational: 'Clean natural sound + light rhythmic cue'
  }

  const hook = hooks[form.genre as keyof typeof hooks][index % hooks[form.genre as keyof typeof hooks].length]
  const title = conceptTitles[form.genre as keyof typeof conceptTitles][index % conceptTitles[form.genre as keyof typeof conceptTitles].length]

  return {
    title,
    hook,
    storyline: `A ${form.people}-person team films a ${form.duration}-second ${form.genre.toLowerCase()} sequence at ${form.location}. The scene opens with ${hook.toLowerCase()} The pacing builds with ${form.equipment} footage and a ${form.mood} mood, ending with a memorable final beat that makes the viewer want the next clip.`,
    locationCategory: locationMap[form.location as keyof typeof locationMap] || form.location,
    sound: moodSound[form.mood as keyof typeof moodSound] || moodSound.cinematic,
    camera: ['Slow push-in', 'Low-angle reveal', 'Wide establishing shot', 'Handheld close-up'][index % 4],
    editing: ['Match cut on motion', 'Short tension rhythm', 'Text intrusion at the reveal', 'Cut on sound cue'][index % 4],
    caption: [`${form.genre} mood, ${form.language} energy`, `Watch this full shot`, `Mini-story, major impact`][index % 3],
    hashtags: ['#ReelSpotAI', '#ShortFormStory', '#CreatorLife', '#Filmmaking', '#UrbanVisuals', '#Storytelling'][index % 6]
  }
}

export default function ReelIdeasPage() {
  const [form, setForm] = useState<IdeaForm>(defaultForm)
  const [concepts, setConcepts] = useState<any[]>([])
  const [status, setStatus] = useState('')

  const generate = () => {
    const next = Array.from({ length: 3 }, (_, idx) => createIdea(form, idx))
    setConcepts(next)
    setStatus('Three original concepts generated. Review them and send the one you like to the planner.')
  }

  const saveSelected = (idea: any) => {
    const saved = JSON.parse(localStorage.getItem('reelspot.savedIdeas') || '[]')
    saved.push({ ...idea, createdAt: new Date().toISOString() })
    localStorage.setItem('reelspot.savedIdeas', JSON.stringify(saved.slice(-12)))
    setStatus(`Saved idea: ${idea.title}`)
  }

  return (
    <div className="page p-4">
      <h1 className="title">Generate My Next Reel</h1>

      <div className="form-grid">
        <label>
          Video genre
          <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label>
          Duration
          <select value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}>
            {DURATIONS.map((d) => <option key={d} value={d}>{d}s</option>)}
          </select>
        </label>
        <label>
          Available filming location
          <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
            {['Marina Beach Access', 'Rose Garden Walk', 'Heritage Courtyard', 'Street Art Lane', 'Forest Pond Path', 'Authorized Rooftop Terrace'].map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </label>
        <label>
          Number of people
          <input type="number" min={1} max={12} value={form.people} onChange={(e) => setForm({ ...form, people: Number(e.target.value) || 1 })} />
        </label>
        <label>
          Equipment
          <select value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })}>
            <option value="phone only">Phone only</option>
            <option value="tripod">Tripod</option>
            <option value="camera">Camera</option>
          </select>
        </label>
        <label>
          Mood
          <select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })}>
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label>
          Language
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            {LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </label>
      </div>

      <button className="btn" onClick={generate}>Generate My Next Reel</button>
      {status && <div className="status-box">{status}</div>}

      <div className="idea-grid">
        {concepts.map((idea, idx) => (
          <article key={`${idea.title}-${idx}`} className="location-card">
            <div className="location-thumb alt-blue"><span>{idea.title}</span></div>
            <div className="location-body">
              <div className="location-topline"><h3>{idea.title}</h3><span>{form.duration}s</span></div>
              <p className="meta"><strong>Hook:</strong> {idea.hook}</p>
              <p className="meta"><strong>Storyline:</strong> {idea.storyline}</p>
              <p className="meta"><strong>Location category:</strong> {idea.locationCategory}</p>
              <p className="meta"><strong>Sound:</strong> {idea.sound}</p>
              <p className="meta"><strong>Camera:</strong> {idea.camera}</p>
              <p className="meta"><strong>Editing:</strong> {idea.editing}</p>
              <p className="meta"><strong>Caption:</strong> {idea.caption}</p>
              <p className="meta"><strong>Hashtags:</strong> {idea.hashtags}</p>
              <div className="button-row">
                <button className="btn small" onClick={() => saveSelected(idea)}>Save</button>
                <button className="btn small ghost" onClick={() => setStatus(`Sent ${idea.title} to the planner.`)}>Send to planner</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
