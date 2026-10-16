import React, { useState } from 'react'

const hours = {
  'Marina Beach Access': { sunrise: '06:10 AM', sunset: '06:32 PM', golden: '05:30 PM - 06:20 PM', blue: '05:00 PM - 05:30 PM' },
  'Rose Garden Walk': { sunrise: '06:20 AM', sunset: '06:25 PM', golden: '05:40 PM - 06:25 PM', blue: '05:10 PM - 05:40 PM' },
  'Heritage Courtyard': { sunrise: '06:15 AM', sunset: '06:28 PM', golden: '05:35 PM - 06:18 PM', blue: '05:08 PM - 05:35 PM' },
  'Street Art Lane': { sunrise: '06:18 AM', sunset: '06:29 PM', golden: '05:37 PM - 06:22 PM', blue: '05:09 PM - 05:37 PM' },
  'Forest Pond Path': { sunrise: '06:00 AM', sunset: '06:40 PM', golden: '05:32 PM - 06:20 PM', blue: '05:05 PM - 05:32 PM' },
  'Authorized Rooftop Terrace': { sunrise: '06:25 AM', sunset: '06:20 PM', golden: '05:28 PM - 06:10 PM', blue: '05:00 PM - 05:28 PM' }
}

const genreRules: Record<string, { recommendation: string; backup: string; note: string }> = {
  Horror: { recommendation: 'Evening or night with legal access and a companion; prioritize a safe, permitted location.', backup: 'Late afternoon for a moody build-up before darkness.', note: 'Horror works best with controlled light and a safe public location.' },
  Nature: { recommendation: 'Daylight or early golden hour for crisp natural detail.', backup: 'Golden hour before sunset if the scene needs warmth.', note: 'Use daylight for clarity and soft motion.' },
  Cinematic: { recommendation: 'Golden hour is the best time for depth and colour.', backup: 'Open overcast daylight if weather is soft and consistent.', note: 'Avoid harsh midday shadows unless you want contrast.' },
  Mystery: { recommendation: 'Overcast daylight or a permitted evening spot with generous light.', backup: 'Blue hour for a moody reveal if access is safe and legal.', note: 'Mystery needs controlled contrast and readable faces.' },
  Sunset: { recommendation: 'Use the local sunset window and keep the final frame in the last 15 minutes before sunset.', backup: 'A quarter-hour after golden hour for softer glow.', note: 'Estimate only — this is not a live weather or live sunset feed.' },
  Portrait: { recommendation: 'Golden hour or soft daylight for flattering skin tones.', backup: 'Blue hour for style-heavy portraits when lighting is controlled.', note: 'Ideal for cleaner framing and soft shadows.' }
}

export default function BestTimePage() {
  const [location, setLocation] = useState('Marina Beach Access')
  const [genre, setGenre] = useState('Horror')
  const [recommendation, setRecommendation] = useState<any>(null)

  const run = () => {
    const info = hours[location as keyof typeof hours]
    const rule = genreRules[genre] || genreRules.Cinematic
    setRecommendation({
      location,
      sunrise: info.sunrise,
      sunset: info.sunset,
      golden: info.golden,
      blue: info.blue,
      recommendation: rule.recommendation,
      backup: rule.backup,
      note: rule.note,
      weather: 'Weather unavailable: real weather source is not connected. This is an estimate only.',
      source: 'Sample estimate. No live weather API configured.'
    })
  }

  return (
    <div className="page p-4">
      <h1 className="title">Best Time to Film</h1>
      <div className="form-grid">
        <label>
          Selected location
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            {Object.keys(hours).map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
        </label>
        <label>
          Video genre
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {Object.keys(genreRules).map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
        </label>
      </div>
      <button className="btn" onClick={run}>Find Best Shooting Time</button>

      {!recommendation && <div className="status-box">No best-time recommendation yet. Choose a location and genre to estimate the best window.</div>}

      {recommendation && (
        <div className="location-card result-card">
          <div className="location-thumb alt-purple"><span>{location}</span></div>
          <div className="location-body">
            <div className="location-topline"><h3>Recommended window</h3><span>{recommendation.recommendation}</span></div>
            <p className="meta"><strong>Sunrise:</strong> {recommendation.sunrise}</p>
            <p className="meta"><strong>Sunset:</strong> {recommendation.sunset}</p>
            <p className="meta"><strong>Golden hour:</strong> {recommendation.golden}</p>
            <p className="meta"><strong>Blue hour:</strong> {recommendation.blue}</p>
            <p className="meta"><strong>Why:</strong> {recommendation.note}</p>
            <p className="meta"><strong>Weather:</strong> {recommendation.weather}</p>
            <p className="meta"><strong>Weather source:</strong> {recommendation.source}</p>
            <p className="meta"><strong>Backup:</strong> {recommendation.backup}</p>
            <p className="meta"><strong>Safety:</strong> Use only lawful public access, safe routes, and a companion when filming at dusk or night.</p>
          </div>
        </div>
      )}
    </div>
  )
}
