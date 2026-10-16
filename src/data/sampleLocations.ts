export type LocationCategory =
  | 'Horror atmosphere'
  | 'Gardens and parks'
  | 'Forests and nature'
  | 'Beaches and waterfronts'
  | 'Urban streets'
  | 'Historic architecture'
  | 'Colorful walls and street art'
  | 'Fashion and portrait photography'
  | 'Cinematic landscapes'
  | 'Cafes and public venues'
  | 'Rooftop-style scenery where access is authorized';

export type SampleLocation = {
  id: string
  name: string
  category: LocationCategory
  atmosphere: string
  latitude: number
  longitude: number
  distanceKm: number
  area: string
  address: string
  access: string
  openingHours: string
  recommendedStyles: string[]
  bestConditions: string[]
  source: string
  directionsLabel: string
}

export const sampleLocations: SampleLocation[] = [
  {
    id: 'marina-quiet',
    name: 'Marina Quiet Edge',
    category: 'Beaches and waterfronts',
    atmosphere: 'Cinematic',
    latitude: 13.0605,
    longitude: 80.2861,
    distanceKm: 4.2,
    area: 'Marina Beach',
    address: 'Marina Beach, Chennai',
    access: 'Public beach access; follow local notices and avoid restricted zones.',
    openingHours: 'Verified only where posted; estimate for sample data only.',
    recommendedStyles: ['Sunset silhouette', 'Wide establishing shots', 'Slow drone-like movement'],
    bestConditions: ['Golden hour', 'Overcast light', 'Open sky after rain'],
    source: 'Sample database — not live verified location data.',
    directionsLabel: 'Marina Beach'
  },
  {
    id: 'park-rose',
    name: 'Rose Garden Walk',
    category: 'Gardens and parks',
    atmosphere: 'Aesthetic',
    latitude: 13.0887,
    longitude: 80.2366,
    distanceKm: 2.6,
    area: 'Near Nungambakkam',
    address: 'Government Botanical Garden area',
    access: 'Public park access during daylight hours; check posted signage.',
    openingHours: 'Sample estimate: 06:00 AM - 07:00 PM.',
    recommendedStyles: ['Slow pans', 'Close-up flower frames', 'Natural motion'],
    bestConditions: ['Morning light', 'Soft daylight', 'Golden hour'],
    source: 'Sample database — not a live verified listing.',
    directionsLabel: 'Rose Garden'
  },
  {
    id: 'heritage-court',
    name: 'Heritage Courtyard',
    category: 'Historic architecture',
    atmosphere: 'Mystery',
    latitude: 13.0834,
    longitude: 80.2608,
    distanceKm: 5.6,
    area: 'George Town',
    address: 'Historic lane, central Chennai',
    access: 'Public courtyard or street area only; do not enter restricted interiors without permission.',
    openingHours: 'Sample estimate only; verify before filming.',
    recommendedStyles: ['Tracking shot', 'Doorway framing', 'Moody close-ups'],
    bestConditions: ['Dusk', 'Soft overcast', 'Night with companion and legal access'],
    source: 'Sample database — not a confirmed filming venue.',
    directionsLabel: 'George Town'
  },
  {
    id: 'street-art',
    name: 'Street Art Lane',
    category: 'Colorful walls and street art',
    atmosphere: 'Urban',
    latitude: 13.0712,
    longitude: 80.2301,
    distanceKm: 7.1,
    area: 'T. Nagar / central lane',
    address: 'Colorful local wall art area',
    access: 'Public pedestrian area; respect private property and no trespassing.',
    openingHours: 'Sample estimate: daylight to evening.',
    recommendedStyles: ['Dynamic motion', 'Color contrast', 'Portrait sequences'],
    bestConditions: ['Late afternoon', 'Golden hour', 'Blue hour'],
    source: 'Sample database — not a live verified listing.',
    directionsLabel: 'Street Art Lane'
  },
  {
    id: 'forest-pond',
    name: 'Forest Pond Path',
    category: 'Forests and nature',
    atmosphere: 'Scary',
    latitude: 13.1461,
    longitude: 80.2089,
    distanceKm: 11.4,
    area: 'Outer city nature edge',
    address: 'Forest path and pond area',
    access: 'Use safe public access areas only. Avoid isolated or restricted zones at night.',
    openingHours: 'Sample estimate only; daylight-first recommended.',
    recommendedStyles: ['Shallow depth of field', 'Slow push-in', 'Wind-heavy ambience'],
    bestConditions: ['Dawn', 'Cloudy daylight', 'Early evening with approved access'],
    source: 'Sample database — not live verified.',
    directionsLabel: 'Forest Pond Path'
  },
  {
    id: 'rooftop-banner',
    name: 'Authorized Rooftop Terrace',
    category: 'Rooftop-style scenery where access is authorized',
    atmosphere: 'Cinematic',
    latitude: 13.0494,
    longitude: 80.2189,
    distanceKm: 3.8,
    area: 'Near office district',
    address: 'Private rooftop with access granted',
    access: 'Access only with permission from venue owner. Do not trespass.',
    openingHours: 'Access time subject to venue permission.',
    recommendedStyles: ['Wide skyline', 'Low-angle portrait', 'Slow reveal'],
    bestConditions: ['Golden hour', 'Blue hour', 'Clear evening sky'],
    source: 'Sample database — permission required before filming.',
    directionsLabel: 'Authorized Rooftop'
  }
]
