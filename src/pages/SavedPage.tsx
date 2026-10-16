import React, { useEffect, useState } from 'react'

export default function SavedPage() {
  const [savedIdeas, setSavedIdeas] = useState<any[]>([])
  const [savedPlans, setSavedPlans] = useState<any[]>([])

  useEffect(() => {
    const ideas = JSON.parse(localStorage.getItem('reelspot.savedIdeas') || '[]')
    const plans = JSON.parse(localStorage.getItem('reelspot.savedPlans') || '[]')
    setSavedIdeas(ideas)
    setSavedPlans(plans)
  }, [])

  return (
    <div className="page p-4">
      <h1 className="title">Saved</h1>
      <div className="saved-grid">
        <div className="location-card">
          <div className="location-thumb"><span>Ideas</span></div>
          <div className="location-body">
            {savedIdeas.length === 0 && <p className="muted">No saved Reel ideas yet.</p>}
            {savedIdeas.map((idea, idx) => (
              <div key={`${idea.title}-${idx}`} className="saved-item">
                <strong>{idea.title}</strong>
                <p>{idea.hook}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="location-card">
          <div className="location-thumb alt-blue"><span>Plans</span></div>
          <div className="location-body">
            {savedPlans.length === 0 && <p className="muted">No saved shooting plans yet.</p>}
            {savedPlans.map((plan, idx) => (
              <div key={`${plan.title}-${idx}`} className="saved-item">
                <strong>{plan.title}</strong>
                <p>{plan.mainConcept}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
