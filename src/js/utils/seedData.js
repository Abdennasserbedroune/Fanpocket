import { db } from '../firebase.js';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const teamsData = [
  {
    id: 'morocco',
    name: 'Morocco',
    titles: 1,
    appearances: 19,
    bestFinish: 'Winner (1976)',
    group2025: 'A',
    flag: '🇲🇦',
    colors: { primary: '#c1272d', secondary: '#006233' },
  },
  {
    id: 'egypt',
    name: 'Egypt',
    titles: 7,
    appearances: 26,
    bestFinish: 'Winner (2010, 2008, 2006)',
    group2025: 'A',
    flag: '🇪🇬',
    colors: { primary: '#ce1126', secondary: '#ffffff' },
  },
  {
    id: 'senegal',
    name: 'Senegal',
    titles: 1,
    appearances: 16,
    bestFinish: 'Winner (2021)',
    group2025: 'B',
    flag: '🇸🇳',
    colors: { primary: '#00853f', secondary: '#fdef42' },
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    titles: 3,
    appearances: 19,
    bestFinish: 'Winner (2013, 1994, 1980)',
    group2025: 'B',
    flag: '🇳🇬',
    colors: { primary: '#008751', secondary: '#ffffff' },
  },
  {
    id: 'cameroon',
    name: 'Cameroon',
    titles: 5,
    appearances: 20,
    bestFinish: 'Winner (2017, 2002, 2000)',
    group2025: 'C',
    flag: '🇨🇲',
    colors: { primary: '#007a3d', secondary: '#ce1126' },
  },
  {
    id: 'algeria',
    name: 'Algeria',
    titles: 2,
    appearances: 19,
    bestFinish: 'Winner (2019, 1990)',
    group2025: 'C',
    flag: '🇩🇿',
    colors: { primary: '#006233', secondary: '#ffffff' },
  },
  {
    id: 'ghana',
    name: 'Ghana',
    titles: 4,
    appearances: 23,
    bestFinish: 'Winner (1982, 1978, 1965, 1963)',
    group2025: 'D',
    flag: '🇬🇭',
    colors: { primary: '#ce1126', secondary: '#fcd116' },
  },
  {
    id: 'ivory-coast',
    name: 'Ivory Coast',
    titles: 2,
    appearances: 24,
    bestFinish: 'Winner (2015, 1992)',
    group2025: 'D',
    flag: '🇨🇮',
    colors: { primary: '#f77f00', secondary: '#009e60' },
  },
];

const getEnvVar = key => {
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  return '';
};

export const seedTeamsData = async () => {
  const devSeedEnabled = getEnvVar('VITE_DEV_SEED_ENABLED') === 'true';

  if (!devSeedEnabled) {
    console.warn(
      'Seeding is disabled. Set VITE_DEV_SEED_ENABLED=true to enable.'
    );
    return;
  }

  try {
    console.log('Starting teams data seeding...');

    for (const team of teamsData) {
      const teamRef = doc(db, 'teams', team.id);
      await setDoc(teamRef, {
        ...team,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`Seeded team: ${team.name}`);
    }

    console.log('Teams data seeding completed successfully');
    return true;
  } catch (error) {
    console.error('Error seeding teams data:', error);
    throw error;
  }
};

if (typeof window !== 'undefined') {
  window.seedTeamsData = seedTeamsData;
}
