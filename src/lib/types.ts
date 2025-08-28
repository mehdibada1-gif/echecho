
import type { Timestamp } from 'firebase/firestore';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'ngo' | 'school' | 'municipality';
  country: string;
  ecoPoints?: number;
  badges: string[];
  profileImage: string;
  ecoProfileDescription?: string;
  contributions: string;
  eventsCreated?: number;
}

export interface Event {
  id: string;
  title: string;
  description:string;
  category: string;
  location?: GeoPoint;
  address: string;
  country: string;
  date: Date | Timestamp;
  endDate: Date | Timestamp;
  cost: number; // 0 for free
  createdBy: string; // userId
  participants: string[]; // array of userIds
  impact: {
    treesPlanted?: number;
    plasticCollectedKg?: number;
  };
  beforePhotos: string[];
  afterPhotos: string[];
}

export interface EventParticipant {
    id?: string;
    eventId: string;
    userId: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: Pick<User, 'name' | 'profileImage' | 'country'>;
  ecoPoints: number;
}

export interface Testimonial {
    name: string;
    country: string;
    avatar: string;
    quote: string;
}

export interface Blog {
    id: string;
    title: string;
    category: string;
    image: string;
    excerpt: string;
    author: string;
    date: Date | Timestamp;
    content: string;
    createdBy: string; // userId
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  website: string;
  ownerId: string; // userId
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: Timestamp;
}

export interface Chat {
    id: string;
    participantIds: string[];
    participants: { [key: string]: Pick<User, 'name' | 'profileImage'> };
    lastMessage: Message | null;
}
