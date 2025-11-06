export interface Team {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  shortCode: string;
  flagUrl: string;
  group: string;
  logo?: string;
  city: string;
  cityAr: string;
  cityFr: string;
  stadium?: string;
  founded?: number;
  colors: {
    primary: string;
    secondary: string;
  };
  league?: string;
  stats?: {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
  squad?: Array<{
    number: number;
    name: string;
    position: string;
    age: number;
    club: string;
  }>;
  description?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
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
