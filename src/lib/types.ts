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
  ecoPoints: number;
  badges: string[];
  profileImage: string;
  ecoProfileDescription?: string;
  contributions: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'cleanup' | 'gardening' | 'recycling' | 'awareness';
  location: GeoPoint;
  address: string;
  country: string;
  date: Date;
  createdBy: string; // userName
  participants: string[]; // array of userNames
  impact: {
    treesPlanted?: number;
    plasticCollectedKg?: number;
  };
  beforePhotos: string[];
  afterPhotos: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user: Pick<User, 'name' | 'profileImage' | 'country'>;
  ecoPoints: number;
}
