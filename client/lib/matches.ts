import { useQuery } from '@tanstack/react-query';
import { Match, MatchWithDetails, Team, Stadium } from '@fanpocket/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiError {
  message: string;
  statusCode?: number;
}

// Helper function for API calls
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    const errorData: ApiError = await response
      .json()
      .catch(() => ({ message: 'Network error' }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

// API response interfaces
interface MatchesResponse {
  matches: MatchWithDetails[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface Filters {
  stage?: string;
  group?: string;
  team?: string;
  stadium?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  limit?: number;
  offset?: number;
}

// Matches API functions
export const matchesApi = {
  getMatches: (filters: Filters = {}): Promise<MatchesResponse> => {
    const params = new URLSearchParams();

    if (filters.stage) params.append('stage', filters.stage);
    if (filters.group) params.append('group', filters.group);
    if (filters.team) params.append('team', filters.team);
    if (filters.stadium) params.append('stadium', filters.stadium);
    if (filters.dateRange) {
      params.append(
        'dateRange',
        `${filters.dateRange.start},${filters.dateRange.end}`
      );
    }
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/matches${queryString ? `?${queryString}` : ''}`;

    return apiRequest<MatchesResponse>(endpoint);
  },

  getMatch: (id: string): Promise<MatchWithDetails> =>
    apiRequest(`/matches/${id}`),

  getMatchesByTeam: (
    teamId: string
  ): Promise<{ matches: MatchWithDetails[] }> =>
    apiRequest(`/matches/team/${teamId}`),

  getMatchesByStadium: (
    stadiumId: string
  ): Promise<{ matches: MatchWithDetails[] }> =>
    apiRequest(`/matches/stadium/${stadiumId}`),

  getTodayMatches: (): Promise<{ matches: MatchWithDetails[] }> =>
    apiRequest('/matches/today'),
};

// React Query hooks
export const useMatches = (filters: Filters = {}) => {
  return useQuery({
    queryKey: ['matches', filters],
    queryFn: () => matchesApi.getMatches(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMatch = (id: string) => {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => matchesApi.getMatch(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};

export const useMatchesByTeam = (teamId: string) => {
  return useQuery({
    queryKey: ['matches', 'team', teamId],
    queryFn: () => matchesApi.getMatchesByTeam(teamId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!teamId,
  });
};

export const useMatchesByStadium = (stadiumId: string) => {
  return useQuery({
    queryKey: ['matches', 'stadium', stadiumId],
    queryFn: () => matchesApi.getMatchesByStadium(stadiumId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!stadiumId,
  });
};

export const useTodayMatches = () => {
  return useQuery({
    queryKey: ['matches', 'today'],
    queryFn: matchesApi.getTodayMatches,
    staleTime: 1 * 60 * 1000, // 1 minute for today's matches
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Teams and Stadiums API functions
export const teamsApi = {
  getTeams: (): Promise<
    Array<{ id: string; name: string; shortCode: string }>
  > => apiRequest('/teams'),
};

export const stadiumsApi = {
  getStadiums: (): Promise<Array<{ id: string; name: string; city: string }>> =>
    apiRequest('/stadiums'),
};

// React Query hooks for teams and stadiums
export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsApi.getTeams,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useStadiums = () => {
  return useQuery({
    queryKey: ['stadiums'],
    queryFn: stadiumsApi.getStadiums,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
