import React, { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { sampleLocations, type SampleLocation } from '../data/sampleLocations'

const DEFAULT_LOCATION: LatLngExpression = [13.0827, 80.2707]
const distanceOptions = [1, 5, 10, 25, 50]
const categoryOptions = ['All', ...new Set(sampleLocations.map((loc) => loc.category))]

export default function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDistance, setSelectedDistance] = useState(10)
  const [sortMode, setSortMode] = useState<'distance' | 'atmosphere' | 'accessibility'>('distance')
  const [manualSearch, setManualSearch] = useState('Chennai')
  const [userCoords, setUserCoords] = useState<LatLngExpression | null>(null)
  const [selected, setSelected] = useState<SampleLocation | null>(sampleLocations[0])
  const [status, setStatus] = useState<string>('Sample dataset only. No live location data is being used.')

  const filteredLocations = useMemo(() => {
    const text = query.trim().toLowerCase()
    const rows = sampleLocations.filter((loc) => {
      const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory
      const matchesDistance = loc.distanceKm <= selectedDistance
      const matchesText = !text || [loc.name, loc.category, loc.area, loc.address, loc.atmosphere].join(' ').toLowerCase().includes(text)
      return matchesCategory && matchesDistance && matchesText
    })

    const sorted = [...rows].sort((a, b) => {
      if (sortMode === 'atmosphere') return a.atmosphere.localeCompare(b.atmosphere)
      if (sortMode === 'accessibility') return (a.access.length - b.access.length)
      return a.distanceKm - b.distanceKm
    })
    return sorted
  }, [query, selectedCategory, selectedDistance, sortMode])

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not available in this browser. Use manual search instead.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setUserCoords([latitude, longitude] as LatLngExpression)
        setStatus('Live location enabled. Your device location is shown on the map.')
      },
      () => {
        setStatus('Location permission denied. Manual search is still available.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleManualSearch = () => {
    setStatus(`Manual search used for "${manualSearch}". This is a local fallback; no real-time service is connected.`)
  }

  const openDirections = (loc: SampleLocation) => {
    const origin = userCoords ? `${(userCoords as number[])[0]},${(userCoords as number[])[1]}` : 'current+location'
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${loc.latitude},${loc.longitude}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page p-4">
      <div className="discover-header">
        <div>
          <p className="eyebrow">Discover</p>
          <h1 className="title">Nearby filming spots</h1>
        </div>
        <button className="btn small" onClick={handleUseLocation}>Use my location</button>
      </div>

      <div className="search-box">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, area, vibe, or location name"
        />
        <div className="search-row">
          <input
            value={manualSearch}
            onChange={(e) => setManualSearch(e.target.value)}
            placeholder="Manual city or area search"
          />
          <button className="btn small" type="button" onClick={handleManualSearch}>Search</button>
        </div>
      </div>

      <div className="filters-row">
        <label>
          Distance
          <select value={selectedDistance} onChange={(e) => setSelectedDistance(Number(e.target.value))}>
            {distanceOptions.map((km) => <option key={km} value={km}>{km} km</option>)}
          </select>
        </label>
        <label>
          Category
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categoryOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </label>
        <label>
          Sort by
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as 'distance' | 'atmosphere' | 'accessibility')}>
            <option value="distance">Distance</option>
            <option value="atmosphere">Atmosphere</option>
            <option value="accessibility">Accessibility</option>
          </select>
        </label>
      </div>

      <div className="status-box">{status}</div>

      <div className="map-shell">
        <MapContainer center={userCoords ?? DEFAULT_LOCATION} zoom={11} scrollWheelZoom className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userCoords && (
            <Marker position={userCoords as LatLngExpression}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {filteredLocations.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude] as LatLngExpression}>
              <Popup>
                <strong>{loc.name}</strong><br />
                {loc.category}<br />
                {loc.distanceKm} km away
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="location-grid">
        {filteredLocations.length === 0 && <div className="empty-state">No matching locations. Try a wider radius or another category.</div>}

        {filteredLocations.map((loc) => (
          <article key={loc.id} className={`location-card ${selected?.id === loc.id ? 'selected' : ''}`} onClick={() => setSelected(loc)}>
            <div className="location-thumb" style={{ background: `linear-gradient(135deg, #8b5cf6, #06b6d4)` }}>
              <span>{loc.category}</span>
            </div>
            <div className="location-body">
              <div className="location-topline">
                <h3>{loc.name}</h3>
                <span>{loc.distanceKm} km</span>
              </div>
              <p className="muted small">{loc.atmosphere} • {loc.area}</p>
              <p className="meta">{loc.address}</p>
              <p className="meta"><strong>Access:</strong> {loc.access}</p>
              <p className="meta"><strong>Hours:</strong> {loc.openingHours}</p>
              <p className="meta"><strong>Best for:</strong> {loc.recommendedStyles.join(', ')}</p>
              <p className="meta"><strong>Source:</strong> {loc.source}</p>
              <div className="pill-row">
                {loc.bestConditions.map((cond) => <span className="chip" key={cond}>{cond}</span>)}
              </div>
              <button className="btn small" type="button" onClick={(e) => { e.stopPropagation(); openDirections(loc) }}>
                Get Directions
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
