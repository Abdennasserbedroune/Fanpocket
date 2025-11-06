export interface Stadium {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  shortName?: string;
  slug: string;
  city: string;
  cityAr: string;
  cityFr: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  addressAr: string;
  addressFr: string;
  capacity: number;
  opened?: number;
  surface?: string;
  homeTeams: string[];
  images: string[];
  description?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  facilities: string[];
  transport?: string[];
  nearbyAttractions?: string[];
  accessibility: {
    parking: boolean;
    publicTransport: boolean;
    wheelchairAccessible: boolean;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface StadiumSummary {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  city: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  capacity: number;
  images: string[];
}
