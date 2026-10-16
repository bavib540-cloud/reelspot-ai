import React from 'react'

export default function ShotPlannerPage() {
  return (
    <div className="page p-4">
      <h1 className="title">Create My Shooting Plan</h1>
      <p className="muted">This section will generate a scene-by-scene plan from a selected idea. The local build supports plan drafting and saving in local storage, while server-side AI generation can be enabled later.</p>
      <div className="location-card">
        <div className="location-thumb alt-purple"><span>Plan Draft</span></div>
        <div className="location-body">
          <p className="meta"><strong>Video title:</strong> Tamil Horror Reel — “நள்ளிரவில் கதவைத் திறக்காதே!”</p>
          <p className="meta"><strong>Opening hook:</strong> A woman hears knocks after the lights go out.</p>
          <p className="meta"><strong>Scene 1:</strong> Quiet doorway and slow push-in.</p>
          <p className="meta"><strong>Scene 2:</strong> Shadow moves under the door, low light, suspense sound.</p>
          <p className="meta"><strong>Cleanup:</strong> Save this plan locally and reopen it from the Saved page.</p>
          <button className="btn small" onClick={() => {
            const saved = JSON.parse(localStorage.getItem('reelspot.savedPlans') || '[]')
            saved.push({ title: 'Tamil Horror Reel — “நள்ளிரவில் கதவைத் திறக்காதே!”', mainConcept: 'Shadow under the door, suspenseful reveal.' })
            localStorage.setItem('reelspot.savedPlans', JSON.stringify(saved.slice(-12)))
          }}>Save draft plan</button>
        </div>
      </div>
    </div>
  )
}
