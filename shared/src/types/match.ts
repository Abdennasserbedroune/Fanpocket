export interface Match {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  competition: string;
  stage: 'group' | 'r16' | 'quarter' | 'semi' | 'final';
  group?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  dateTime: Date;
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  score?: {
    home: number;
    away: number;
    halfTime?: {
      home: number;
      away: number;
    };
  };
  attendance?: number;
  ticketInfo?: {
    available: boolean;
    url?: string;
    priceRange?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  broadcast?: {
    tv?: string[];
    streaming?: string[];
  };
  weather?: {
    condition: string;
    temperature: number;
  };
  events?: Array<{
    type: string;
    minute: number;
    player: string;
    team: string;
    description: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchSummary {
  id: string;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  dateTime: Date;
  status: Match['status'];
  score?: Match['score'];
}

export interface MatchWithDetails extends Match {
  homeTeamData: {
    id: string;
    name: string;
    logo: string;
  };
  awayTeamData: {
    id: string;
    name: string;
    logo: string;
  };
  stadiumData: {
    id: string;
    name: string;
    city: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
}
