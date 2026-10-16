import React from 'react'

export default function SavedPage(){
  return (
    <div className="page p-4">
      <h1 className="title">Saved</h1>
      <p className="muted">Saved locations, ideas and shooting plans will appear here. Persistence is via Supabase when configured, otherwise localStorage fallback will be used.</p>
    </div>
  )
}
