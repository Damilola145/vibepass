export interface User {
  id: number;
  email: string;
  name: string;
  isAdmin?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  category: 'Music' | 'Art' | 'Tech' | 'Food' | 'Sports' | 'Business';
  image: string;
  organizer: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userEmail: string;
  purchaseDate: string;
  qrValue: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

export const CATEGORIES = ['All', 'Music', 'Art', 'Tech', 'Food', 'Sports', 'Business'] as const;

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Solstice Jazz Gala',
    description: 'An elegant evening of smooth jazz under the stars. Featuring world-renowned saxophonists and a gourmet dinner service.',
    date: '2026-06-21T19:00:00',
    location: 'Riverside Amphitheater',
    price: 65,
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Vibe Productions'
  },
  {
    id: '2',
    title: 'Digital Art Expo 2026',
    description: 'Explore the intersection of technology and creativity. Featuring VR installations, NFT galleries, and live digital painting.',
    date: '2026-05-10T10:00:00',
    location: 'Modern Art Museum',
    price: 25,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Creative Minds Collective'
  },
  {
    id: '3',
    title: 'Tech Summit: Future AI',
    description: 'Join industry leaders for a day of talks and workshops on the future of Artificial Intelligence and its impact on society.',
    date: '2026-06-22T09:00:00',
    location: 'Innovation Hub',
    price: 150,
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1200',
    organizer: 'TechForward'
  },
  {
    id: '4',
    title: 'Gourmet Street Food Tour',
    description: 'Taste the best street food the city has to offer. From spicy tacos to artisanal desserts, there\'s something for everyone.',
    date: '2026-04-20T12:00:00',
    location: 'Central Park Plaza',
    price: 15,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200',
    organizer: 'City Eats'
  },
  {
    id: '5',
    title: 'Championship Finals: Basketball',
    description: 'The final game of the season. Witness the intensity as the top two teams battle it out for the trophy.',
    date: '2026-05-05T19:30:00',
    location: 'Victory Stadium',
    price: 80,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Pro League'
  },
  {
    id: '6',
    title: 'Startup Pitch Night',
    description: 'Watch the next generation of entrepreneurs pitch their ideas to a panel of expert investors.',
    date: '2026-04-30T18:00:00',
    location: 'The Loft Coworking',
    price: 10,
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Venture Hub'
  }
];
