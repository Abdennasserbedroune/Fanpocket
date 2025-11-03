export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  favoriteTeams: string[];
  favoriteStadiums: string[];
  notificationPreferences: {
    matchReminders: boolean;
    teamNews: boolean;
    stadiumEvents: boolean;
  };
  locale: 'en' | 'fr' | 'ar';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends Omit<User, 'email'> {
  matchesAttended: number;
  stadiumsVisited: number;
  reviewsCount: number;
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  displayName: string;
  locale?: 'en' | 'fr' | 'ar';
}

export interface UpdateUserDto {
  displayName?: string;
  avatar?: string;
  favoriteTeams?: string[];
  favoriteStadiums?: string[];
  notificationPreferences?: Partial<User['notificationPreferences']>;
  locale?: 'en' | 'fr' | 'ar';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
