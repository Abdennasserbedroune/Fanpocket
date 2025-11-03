export interface Team {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  shortCode: string;
  flag: string;
  logo: string;
  group?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  city: string;
  cityAr: string;
  cityFr: string;
  stadium?: string;
  founded?: number;
  colors: {
    primary: string;
    secondary: string;
  };
  league: string;
  description?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  stats?: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  squad?: Array<{
    number: number;
    name: string;
    position: string;
    age?: number;
    club?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamSummary {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  logo: string;
  city: string;
}
