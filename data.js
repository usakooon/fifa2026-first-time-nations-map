/* Data is kept in global scope so the static GitHub Pages site needs no bundler. */
const journeyData = {
  origin: {
    id: 'tashkent',
    type: 'country_origin',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    location: 'Tashkent, Uzbekistan',
    coordinates: [69.2401, 41.2995],
    description: 'Uzbekistan makes its first appearance at the FIFA World Cup.'
  },
  baseCamp: {
    id: 'base-camp',
    type: 'base_camp',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    baseCamp: 'Atlanta United Training Centre',
    city: 'Atlanta / Marietta',
    coordinates: [-84.523, 33.942],
    icon: 'house',
    description: 'A professional MLS training facility used as Uzbekistan’s World Cup base camp. It provides a stable environment for training, recovery, and team preparation.'
  },
  venues: [
    {
      id: 'mexico-city',
      type: 'match_venue',
      match: 'Match 1',
      date: 'June 17',
      opponent: 'Colombia',
      venue: 'Mexico City Stadium',
      city: 'Mexico City',
      coordinates: [-99.1505, 19.3029],
      transport: 'flight',
      icon: 'stadium'
    },
    {
      id: 'houston',
      type: 'match_venue',
      match: 'Match 2',
      date: 'June 23',
      opponent: 'Portugal',
      venue: 'Houston Stadium',
      city: 'Houston',
      coordinates: [-95.4107, 29.6847],
      transport: 'flight',
      icon: 'stadium'
    },
    {
      id: 'atlanta-stadium',
      type: 'match_venue',
      match: 'Match 3',
      date: 'June 27',
      opponent: 'DR Congo',
      venue: 'Atlanta Stadium',
      city: 'Atlanta',
      coordinates: [-84.4008, 33.7554],
      transport: 'car_same_city',
      icon: 'stadium'
    }
  ]
};

const scenes = [
  {
    title: 'Uzbekistan’s First World Cup Journey',
    location: 'North America',
    description: 'Uzbekistan’s First World Cup Journey: From Tashkent to the World Cup Stage.',
    center: [-98.5795, 39.8283], zoom: 3.15, pitch: 55, bearing: -18,
    showPoints: ['tashkent', 'base-camp', 'mexico-city', 'houston', 'atlanta-stadium'], showRoutes: []
  },
  {
    title: '🇺🇿 Uzbekistan introduction',
    location: 'Tashkent, Uzbekistan',
    description: 'First World Cup appearance. Starting point: Tashkent, the symbolic departure point for a first-time nation.',
    center: [69.2401, 41.2995], zoom: 10.5, pitch: 60, bearing: 22,
    details: { Country: 'Uzbekistan', Milestone: 'First World Cup appearance', 'Starting point': 'Tashkent' },
    showPoints: ['tashkent'], showRoutes: []
  },
  {
    title: 'From Tashkent to Atlanta',
    location: 'Tashkent → Atlanta / Marietta',
    description: 'A long blue arc carries the team from Uzbekistan toward its North American preparation base.',
    center: [-8, 50], zoom: 2.1, pitch: 52, bearing: -35,
    details: { Transport: 'Long-distance flight', Route: 'Tashkent → Atlanta United Training Centre' },
    showPoints: ['tashkent', 'base-camp'], showRoutes: ['tashkent-base'], animateRoute: 'tashkent-base'
  },
  {
    title: '🏠 Base camp',
    location: 'Atlanta United Training Centre, Atlanta / Marietta',
    description: 'A professional training facility for preparation, recovery, and team meetings.',
    center: [-84.523, 33.942], zoom: 12.3, pitch: 60, bearing: 32,
    details: { Team: '🇺🇿 Uzbekistan', 'Base Camp': 'Atlanta United Training Centre', City: 'Atlanta / Marietta' },
    showPoints: ['base-camp'], showRoutes: []
  },
  {
    title: 'Three match venues overview',
    location: 'Southeastern United States and Mexico',
    description: 'Base camp, Mexico City Stadium, Houston Stadium, and Atlanta Stadium form the tournament geography.',
    center: [-90.0, 29.5], zoom: 4.35, pitch: 54, bearing: -12,
    showPoints: ['base-camp', 'mexico-city', 'houston', 'atlanta-stadium'], showRoutes: ['base-mexico', 'base-houston', 'base-atlanta']
  },
  {
    title: '🏟️ Match 1 venue',
    location: 'Mexico City Stadium, Mexico City',
    description: 'Atlanta to Mexico City is the longest match trip from the base camp.',
    center: [-99.1505, 19.3029], zoom: 11.1, pitch: 62, bearing: 18,
    details: { Date: 'June 17', Opponent: 'Colombia', Venue: 'Mexico City Stadium', City: 'Mexico City', Transport: 'Flight' },
    showPoints: ['base-camp', 'mexico-city'], showRoutes: ['base-mexico'], animateRoute: 'base-mexico'
  },
  {
    title: '🏟️ Match 2 venue',
    location: 'Houston Stadium, Houston',
    description: 'A domestic flight links the Atlanta base with the Houston match venue.',
    center: [-95.4107, 29.6847], zoom: 11.3, pitch: 60, bearing: -24,
    details: { Date: 'June 23', Opponent: 'Portugal', Venue: 'Houston Stadium', City: 'Houston', Transport: 'Flight' },
    showPoints: ['base-camp', 'houston'], showRoutes: ['base-houston'], animateRoute: 'base-houston'
  },
  {
    title: '🏟️ Match 3 venue',
    location: 'Atlanta Stadium, Atlanta',
    description: 'The final group-stage movement is same-city travel from the base camp to Atlanta Stadium.',
    center: [-84.4008, 33.7554], zoom: 12.1, pitch: 58, bearing: 42,
    details: { Date: 'June 27', Opponent: 'DR Congo', Venue: 'Atlanta Stadium', City: 'Atlanta', Transport: 'Same-city car movement' },
    showPoints: ['base-camp', 'atlanta-stadium'], showRoutes: ['base-atlanta'], animateRoute: 'base-atlanta'
  },
  {
    title: 'Travel comparison',
    location: 'Atlanta United Training Centre',
    description: 'For a first-time nation, travel planning is also part of preparation.',
    center: [-84.523, 33.942], zoom: 5.2, pitch: 56, bearing: -30,
    details: { 'Mexico City': 'long-distance flight', Houston: 'domestic flight', 'Atlanta Stadium': 'same-city movement' },
    showPoints: ['base-camp', 'mexico-city', 'houston', 'atlanta-stadium'], showRoutes: ['base-mexico', 'base-houston', 'base-atlanta'], compare: true
  },
  {
    title: 'Ending',
    location: 'North America',
    description: 'Uzbekistan’s first World Cup is also a journey across places, distances, and preparation.',
    center: [-98.5795, 39.8283], zoom: 3.25, pitch: 55, bearing: 16,
    details: { Start: 'Tashkent', Base: 'Atlanta United Training Centre', Venues: 'Mexico City, Houston, Atlanta' },
    showPoints: ['tashkent', 'base-camp', 'mexico-city', 'houston', 'atlanta-stadium'], showRoutes: ['tashkent-base', 'base-mexico', 'base-houston', 'base-atlanta']
  }
];
