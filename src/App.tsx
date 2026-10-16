import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import DiscoverPage from './pages/DiscoverPage'
import ReelIdeasPage from './pages/ReelIdeasPage'
import BestTimePage from './pages/BestTimePage'
import ShotPlannerPage from './pages/ShotPlannerPage'
import SavedPage from './pages/SavedPage'
import PaymentPage from './pages/PaymentPage'
import AdminPaymentsPage from './pages/AdminPaymentsPage'

const BottomNav: React.FC = () => {
  const loc = useLocation()
  const items = [
    { to: '/', label: 'Discover' },
    { to: '/ideas', label: 'Reel Ideas' },
    { to: '/best-time', label: 'Best Time' },
    { to: '/planner', label: 'Shot Planner' },
    { to: '/saved', label: 'Saved' }
  ]
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <Link key={it.to} to={it.to} className={loc.pathname === it.to ? 'active' : ''}>{it.label}</Link>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/ideas" element={<ReelIdeasPage />} />
        <Route path="/best-time" element={<BestTimePage />} />
        <Route path="/planner" element={<ShotPlannerPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/billing" element={<PaymentPage user={null} />} />
        <Route path="/admin" element={<AdminPaymentsPage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
