export interface MapTeam {
  _id: string;
  id?: string;
  name: string;
  shortCode?: string;
  flagUrl?: string;
  group?: string;
  colors?: {
    primary?: string;
    secondary?: string;
  };
}

export interface MapMatch {
  _id: string;
  id?: string;
  matchNumber?: number;
  stage?: string;
  group?: string;
  status?: string;
  dateTime: string;
  stadium?: string;
  homeTeam: MapTeam | null;
  awayTeam: MapTeam | null;
}

export interface MapStadium {
  _id: string;
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  shortName?: string;
  slug: string;
  city: string;
  cityAr: string;
  cityFr: string;
  address: string;
  capacity: number;
  images?: string[];
  facilities?: string[];
  transport?: string[];
  nearbyAttractions?: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  upcomingMatches: MapMatch[];
  recentMatches?: MapMatch[];
  distance?: number;
  distanceInKm?: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

export type AmenityCategory = 'restaurant' | 'hotel' | 'atm' | 'hospital';

export interface AmenityFeature {
  id: string;
  stadiumId: string;
  stadiumSlug: string;
  name: string;
  category: AmenityCategory;
  lat: number;
  lng: number;
}
