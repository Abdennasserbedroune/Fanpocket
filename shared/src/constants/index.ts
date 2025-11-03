export const SUPPORTED_LOCALES = ['en', 'fr', 'ar'] as const;
export const DEFAULT_LOCALE = 'en';

export const MOROCCAN_LEAGUES = {
  BOTOLA_PRO: 'Botola Pro',
  BOTOLA_2: 'Botola 2',
} as const;

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
  POSTPONED: 'postponed',
  CANCELLED: 'cancelled',
} as const;

export const THEME_COLORS = {
  moroccanRed: '#C1272D',
  islamicGreen: '#006233',
  gold: '#FFD700',
  sand: '#F4E4C1',
  deepBlue: '#003366',
} as const;
