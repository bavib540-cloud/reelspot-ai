import React, { useMemo, useState } from 'react'

type PlanForm = {
  genre: string
  duration: number
  location: string
  time: string
  equipment: string
  people: number
  language: string
  style: string
}

type Scene = {
  label: string
  duration: string
  angle: string
  movement: string
  action: string
  lighting: string
  background: string
  sound: string
  music: string
  transition: string
  edit: string
  onScreenText: string
  voiceover: string
}

type ShootingPlan = {
  title: string
  concept: string
  hook: string
  scenes: Scene[]
  checklist: string[]
  finalChecklist: string[]
}

const defaultForm: PlanForm = {
  genre: 'Horror',
  duration: 40,
  location: 'Marina Beach Access',
  time: 'Evening',
  equipment: 'phone only',
  people: 2,
  language: 'Tamil',
  style: 'Moody and cinematic'
}

const sceneTemplates: Record<string, { title: string; hook: string; concept: string }[]> = {
  Horror: [
    { title: 'The Quiet Threshold', hook: 'The frame goes still before the knock is heard.', concept: 'A suspenseful reveal built around a safe public-facing doorway and slow camera movement.' },
    { title: 'The Wrong Shadow', hook: 'Something moves beneath the door before the character notices.', concept: 'Shadow work, low light, and a restrained slow push-in create tension.' },
    { title: 'The Final Reveal', hook: 'The shot holds on the silence before the cut.', concept: 'A brief visual payoff that lands on a clean final frame.' }
  ],
  Cinematic: [
    { title: 'Golden Establishing Shot', hook: 'The city glows before the story begins.', concept: 'A wide frame with movement and emotional arc.' },
    { title: 'The Human Detail', hook: 'A gesture becomes the emotional engine.', concept: 'Portrait close-ups and a soft, controlled edit.' },
    { title: 'Final Beat', hook: 'The final frame carries the feeling.', concept: 'A strong closing shot with minimal dialogue.' }
  ],
  Funny: [
    { title: 'The Accident', hook: 'The setup is completely normal until it isn’t.', concept: 'A comedic reaction sequence shot in quick exchanges.' },
    { title: 'The Reveal', hook: 'The third angle makes the joke land.', concept: 'Fast-paced edits and clean timing.' },
    { title: 'The Ending', hook: 'A deadpan final frame lands the punchline.', concept: 'A beat and reset that makes the video replayable.' }
  ],
  Educational: [
    { title: 'The Visual Hook', hook: 'One detail explains the whole concept.', concept: 'Fast-paced visual breakdown with clean text overlays.' },
    { title: 'The Technique', hook: 'The audience is shown the why before the final result.', concept: 'A process-driven sequence with quick, clear shots.' },
    { title: 'Final takeaway', hook: 'The lesson lands in one clean final frame.', concept: 'Short closing explanation with direct captioning.' }
  ]
}

function buildPlan(form: PlanForm): ShootingPlan {
  const template = sceneTemplates[form.genre] || sceneTemplates.Cinematic
  const travelText = form.location === 'Marina Beach Access' ? 'quiet waterfront edge with legal public access' : form.location

  const scenes: Scene[] = [
    {
      label: 'Scene 1',
      duration: '0–6s',
      angle: 'Wide establishing angle',
      movement: 'Slow push-in',
      action: `Open on ${travelText} in ${form.time.toLowerCase()} light. The subject begins with a calm setup and a subtle look toward the frame.`,
      lighting: form.genre === 'Horror' ? 'Low, soft practical light with a controlled silhouette' : 'Soft daylight or golden-hour fill',
      background: form.genre === 'Horror' ? 'Quiet, slightly atmospheric surroundings with limited movement' : 'Balanced environment with natural depth',
      sound: form.genre === 'Horror' ? 'Wind ambience + faint distant noises' : 'Natural ambiences with light texture',
      music: form.genre === 'Horror' ? 'Low drone and tension pad' : form.genre === 'Funny' ? 'Light playful rhythm' : 'Gentle emotional build',
      transition: 'Cut on sound cue or match-cut motion',
      edit: 'Hold the frame for one extra beat before the cut.',
      onScreenText: form.language === 'Tamil' ? 'எல்லாம் அமைதியாக இருந்தது…' : 'Everything seemed normal…',
      voiceover: form.language === 'Tamil' ? 'சரியாக தெரியாத ஒரு சத்தம்…' : 'Something felt off before the first reveal.'
    },
    {
      label: 'Scene 2',
      duration: '6–14s',
      angle: 'Medium close-up',
      movement: 'Slow lateral drift',
      action: `The main subject notices something unexpected near ${form.location}. The pacing is subtle but tense.`,
      lighting: form.genre === 'Horror' ? 'Dim, directional shadows, careful subject separation' : 'Warm contrast with soft fill',
      background: form.genre === 'Horror' ? 'Quiet environment with minimal movement and a low-contrast edge' : 'Clean background with controlled depth',
      sound: form.genre === 'Funny' ? 'Small foley hits and quick rhythm' : 'Subtle tension layer or natural sound design',
      music: form.genre === 'Funny' ? 'Playful plucks and rhythmic cut-ins' : 'Slow build under the scene',
      transition: 'Match cut on the subject glance',
      edit: 'Trim movement but keep the reaction readable.',
      onScreenText: form.language === 'Tamil' ? 'அது எதுவாக இருக்கும்?' : 'What was that?',
      voiceover: form.language === 'Tamil' ? 'முதல் தடங்கலின் பின்னால் ஒரு அசைவைக் கவனித்தேன்.' : 'I noticed a movement just before the tension took shape.'
    },
    {
      label: 'Scene 3',
      duration: '14–24s',
      angle: 'Over-the-shoulder or low angle',
      movement: 'Short dolly-in or handheld drift',
      action: `Build the key beat with ${form.people} available person(s) and ${form.equipment} setup. Keep the action readable and controlled.`,
      lighting: form.genre === 'Horror' ? 'Low-key with practical highlight' : 'Balanced fill with a brighter accent',
      background: 'Natural background, no clutter, keep focus on the subject',
      sound: form.genre === 'Horror' ? 'Three distant knocks or a rising ambient texture' : 'Tight ambience with a clean payoff cue',
      music: 'Build the beat under the reveal with a controlled crescendo',
      transition: 'Cut on the final sound hit',
      edit: 'Use a quick jump-cut rhythm only if it improves tension.',
      onScreenText: form.language === 'Tamil' ? 'நடந்தது உண்மைதானா?' : 'Was it real?',
      voiceover: form.language === 'Tamil' ? 'மீண்டும் திரும்பியபோது, உண்மையில் ஏதோ மாறிவிட்டது.' : 'When I looked back, something had changed.'
    },
    {
      label: 'Scene 4',
      duration: '24–33s',
      angle: 'Close-up or reveal angle',
      movement: 'Slow push-in or vertical glide',
      action: 'Give the viewer the final visual piece — keep it brief and impactful. Let the subject react without overexplaining.',
      lighting: 'Use a single controlled highlight so the eye lands on the reveal',
      background: 'Keep the backdrop clean and atmospheric, not overly busy',
      sound: 'Match the reveal to the sound cue and cut on the breath',
      music: 'A final textured swell or clean emotional pad',
      transition: 'Hard cut or clean whip-pan transition',
      edit: 'Keep the reveal as the longest hold of the sequence.',
      onScreenText: form.language === 'Tamil' ? 'அது இன்னும் அங்கேயே இருந்தது.' : 'It was still there.',
      voiceover: form.language === 'Tamil' ? 'அந்தத் தருணம் நின்றுவிட்டது.' : 'The moment stopped before the cut.'
    },
    {
      label: 'Scene 5',
      duration: '33–40s',
      angle: 'Final frame',
      movement: 'Static hold',
      action: 'End on the cleanest last shot: a simple, unforgettable visual beat that leaves the viewer with the mood.',
      lighting: 'Keep the final frame readable and intentional',
      background: 'Minimal and atmospheric',
      sound: 'Let the silence or low ambience carry the finish',
      music: 'Pull back to silence or a final low drone',
      transition: 'Hard cut to black or a soft fade out',
      edit: 'Hold the frame and let the final beat breathe.',
      onScreenText: form.language === 'Tamil' ? 'இனி திரும்பிப் பார்க்காதே.' : 'Don’t look back now.',
      voiceover: form.language === 'Tamil' ? 'இதைப் பார்த்த பிறகு, விசித்திரம் முடிவடையவில்லை.' : 'The story ends only when the frame stops.'
    }
  ]

  return {
    title: `${form.language} ${form.genre} Reel — “${template[0].title}”`,
    concept: template[0].concept,
    hook: template[0].hook,
    scenes,
    checklist: [
      `Confirm legal access and safety for ${form.location}.`,
      `Keep the plan aligned to ${form.time.toLowerCase()} lighting conditions.`,
      `Check ${form.equipment} setup and subject positioning before the first take.`,
      `Record natural sound and any required ambience before cutting.`,
      `Keep the final reveal readable and not overlit.`
    ],
    finalChecklist: [
      'Review all clips for continuity and exposure.',
      'Trim to the pacing rhythm and avoid unnecessary filler.',
      'Apply the same color grade throughout the sequence.',
      'Add the final sound design and any captions or VO in the selected language.',
      'Save the final version and export multiple versions for vertical social delivery.'
    ]
  }
}

export default function ShotPlannerPage() {
  const [form, setForm] = useState<PlanForm>(defaultForm)
  const [plan, setPlan] = useState<ShootingPlan | null>(null)
  const [status, setStatus] = useState('')

  const canGenerate = useMemo(() => form.genre && form.location && form.time, [form])

  const handleGenerate = () => {
    const generated = buildPlan(form)
    setPlan(generated)
    setStatus('Plan generated. You can copy, edit, or save it.')
  }

  const handleSave = () => {
    if (!plan) return
    const saved = JSON.parse(localStorage.getItem('reelspot.savedPlans') || '[]')
    saved.push({ ...plan, createdAt: new Date().toISOString() })
    localStorage.setItem('reelspot.savedPlans', JSON.stringify(saved.slice(-12)))
    setStatus('Plan saved locally.')
  }

  const handleCopy = async () => {
    if (!plan) return
    const text = [
      `VIDEO: ${plan.title}`,
      `CONCEPT: ${plan.concept}`,
      `HOOK: ${plan.hook}`,
      ...plan.scenes.flatMap((scene) => [
        `${scene.label} — ${scene.duration}`,
        `Angle: ${scene.angle}`,
        `Movement: ${scene.movement}`,
        `Action: ${scene.action}`,
        `Lighting: ${scene.lighting}`,
        `Background: ${scene.background}`,
        `Sound: ${scene.sound}`,
        `Music: ${scene.music}`,
        `Transition: ${scene.transition}`,
        `Editing: ${scene.edit}`,
        `Text: ${scene.onScreenText}`,
        `VO: ${scene.voiceover}`
      ])
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setStatus('Plan copied to clipboard.')
    } catch {
      setStatus('Copy failed in this browser. You can still save the plan locally.')
    }
  }

  return (
    <div className="page p-4">
      <h1 className="title">Create My Shooting Plan</h1>
      <div className="form-grid">
        <label>
          Video genre
          <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
            {['Horror', 'Cinematic', 'Funny', 'Educational', 'Mystery'].map((genre) => <option key={genre} value={genre}>{genre}</option>)}
          </select>
        </label>
        <label>
          Video duration
          <select value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}>
            {[15, 30, 45, 60].map((d) => <option key={d} value={d}>{d}s</option>)}
          </select>
        </label>
        <label>
          Selected location
          <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
            {['Marina Beach Access', 'Rose Garden Walk', 'Heritage Courtyard', 'Street Art Lane', 'Forest Pond Path', 'Authorized Rooftop Terrace'].map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </label>
        <label>
          Shooting time
          <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
            {['Golden hour', 'Sunset', 'Evening', 'Daylight', 'Night (legal access only)'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
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
          Number of people
          <input type="number" min={1} max={12} value={form.people} onChange={(e) => setForm({ ...form, people: Number(e.target.value) || 1 })} />
        </label>
        <label>
          Language
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            {['Tamil', 'English', 'Hindi'].map((lang) => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </label>
        <label>
          Visual style
          <input value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} />
        </label>
      </div>

      <div className="button-row">
        <button className="btn" onClick={handleGenerate} disabled={!canGenerate}>Create My Shooting Plan</button>
        <button className="btn ghost" onClick={handleCopy} disabled={!plan}>Copy plan</button>
        <button className="btn ghost" onClick={handleSave} disabled={!plan}>Save plan</button>
      </div>

      {status && <div className="status-box">{status}</div>}

      {plan && (
        <div className="location-card result-card">
          <div className="location-thumb alt-purple"><span>{plan.title}</span></div>
          <div className="location-body">
            <p className="meta"><strong>Concept:</strong> {plan.concept}</p>
            <p className="meta"><strong>Hook:</strong> {plan.hook}</p>
            <p className="meta"><strong>Duration:</strong> {form.duration}s</p>
            <p className="meta"><strong>Location:</strong> {form.location}</p>
            <p className="meta"><strong>Shooting time:</strong> {form.time}</p>

            {plan.scenes.map((scene) => (
              <div key={scene.label} className="saved-item">
                <strong>{scene.label} — {scene.duration}</strong>
                <p className="meta"><strong>Angle:</strong> {scene.angle}</p>
                <p className="meta"><strong>Movement:</strong> {scene.movement}</p>
                <p className="meta"><strong>Action:</strong> {scene.action}</p>
                <p className="meta"><strong>Lighting:</strong> {scene.lighting}</p>
                <p className="meta"><strong>Background:</strong> {scene.background}</p>
                <p className="meta"><strong>Sound:</strong> {scene.sound}</p>
                <p className="meta"><strong>Music mood:</strong> {scene.music}</p>
                <p className="meta"><strong>Transition:</strong> {scene.transition}</p>
                <p className="meta"><strong>Editing:</strong> {scene.edit}</p>
                <p className="meta"><strong>On-screen text:</strong> {scene.onScreenText}</p>
                <p className="meta"><strong>VO / dialogue:</strong> {scene.voiceover}</p>
              </div>
            ))}

            <div className="saved-item">
              <strong>Filming checklist</strong>
              <ul>
                {plan.checklist.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div className="saved-item">
              <strong>Final editing checklist</strong>
              <ul>
                {plan.finalChecklist.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
