import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { buildLocalIdeas, generateReelIdeas, type ReelIdeaForm } from '../lib/reelIdeas'

const LANGUAGES = ['Tamil', 'English', 'Hindi', 'Kannada']
const GENRES = ['Horror', 'Cinematic', 'Funny', 'Mysterious', 'Emotional', 'Aesthetic', 'Educational']
const DURATIONS = [15, 30, 45, 60]
const MOODS = ['scary', 'cinematic', 'funny', 'mysterious', 'emotional', 'aesthetic', 'educational']

const defaultForm: ReelIdeaForm = {
  genre: 'Horror',
  duration: 30,
  location: 'Marina Beach Access',
  people: 2,
  equipment: 'phone only',
  mood: 'scary',
  language: 'Tamil'
}

export default function ReelIdeasPage() {
  const [form, setForm] = useState<ReelIdeaForm>(defaultForm)
  const [concepts, setConcepts] = useState<any[]>([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    const loadCredits = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) return
      const { data } = await supabase.from('subscriptions').select('remaining_credits').eq('user_id', userId).limit(1)
      if (data && data[0]) setCredits(data[0].remaining_credits)
    }
    loadCredits()
  }, [])

  const generate = async () => {
    setLoading(true)
    setStatus('Generating concepts...')
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      const result = await generateReelIdeas(form, accessToken)
      setConcepts(result.ideas)
      setStatus(result.message || 'Three original concepts generated. Review and save the idea you like.')
      const nextCredits = await getCurrentCredits()
      setCredits(nextCredits)
    } catch (error: any) {
      setStatus(error.message || 'Generation failed.')
      setConcepts(buildLocalIdeas(form))
    } finally {
      setLoading(false)
    }
  }

  const getCurrentCredits = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) return null
    const { data } = await supabase.from('subscriptions').select('remaining_credits').eq('user_id', userId).limit(1)
    return data && data[0] ? data[0].remaining_credits : null
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
      {credits !== null && <div className="status-box">Remaining generations: {credits}</div>}

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

      <button className="btn" onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate My Next Reel'}</button>
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
