export interface Stadium {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  shortName: string;
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
  accessibility: {
    parking: boolean;
    publicTransport: boolean;
    wheelchairAccessible: boolean;
  };
  transport?: Array<{
    type: string;
    description: string;
    descriptionAr: string;
    descriptionFr: string;
  }>;
  nearbyAttractions?: Array<{
    name: string;
    nameAr: string;
    nameFr: string;
    description: string;
    descriptionAr: string;
    descriptionFr: string;
    distance: number;
  }>;
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
