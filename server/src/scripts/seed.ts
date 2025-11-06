import mongoose from 'mongoose';
import { config } from '../config';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';
import { Match } from '../models/Match';

// AFCON 2025 Teams Data
const teamsData = [
  // Group A
  {
    name: 'Morocco',
    nameAr: 'المغرب',
    nameFr: 'Maroc',
    slug: 'morocco',
    shortCode: 'MAR',
    flagUrl: 'https://flagcdn.com/w320/ma.png',
    group: 'A',
    city: 'Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    colors: { primary: '#C1272D', secondary: '#006233' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Mali',
    nameAr: 'مالي',
    nameFr: 'Mali',
    slug: 'mali',
    shortCode: 'MLI',
    flagUrl: 'https://flagcdn.com/w320/ml.png',
    group: 'A',
    city: 'Bamako',
    cityAr: 'باماكو',
    cityFr: 'Bamako',
    colors: { primary: '#14B53A', secondary: '#FFD700' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Zambia',
    nameAr: 'زامبيا',
    nameFr: 'Zambie',
    slug: 'zambia',
    shortCode: 'ZAM',
    flagUrl: 'https://flagcdn.com/w320/zm.png',
    group: 'A',
    city: 'Lusaka',
    cityAr: 'لوساكا',
    cityFr: 'Lusaka',
    colors: { primary: '#FF8C00', secondary: '#008000' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Comoros',
    nameAr: 'جزر القمر',
    nameFr: 'Comores',
    slug: 'comoros',
    shortCode: 'COM',
    flagUrl: 'https://flagcdn.com/w320/km.png',
    group: 'A',
    city: 'Moroni',
    cityAr: 'موروني',
    cityFr: 'Moroni',
    colors: { primary: '#FFD700', secondary: '#006400' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },

  // Group B
  {
    name: 'Egypt',
    nameAr: 'مصر',
    nameFr: 'Égypte',
    slug: 'egypt',
    shortCode: 'EGY',
    flagUrl: 'https://flagcdn.com/w320/eg.png',
    group: 'B',
    city: 'Cairo',
    cityAr: 'القاهرة',
    cityFr: 'Le Caire',
    colors: { primary: '#FFFFFF', secondary: '#000000' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'South Africa',
    nameAr: 'جنوب أفريقيا',
    nameFr: 'Afrique du Sud',
    slug: 'south-africa',
    shortCode: 'RSA',
    flagUrl: 'https://flagcdn.com/w320/za.png',
    group: 'B',
    city: 'Johannesburg',
    cityAr: 'جوهانسبرغ',
    cityFr: 'Johannesbourg',
    colors: { primary: '#007A4D', secondary: '#FFB612' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Angola',
    nameAr: 'أنغولا',
    nameFr: 'Angola',
    slug: 'angola',
    shortCode: 'ANG',
    flagUrl: 'https://flagcdn.com/w320/ao.png',
    group: 'B',
    city: 'Luanda',
    cityAr: 'لواندا',
    cityFr: 'Luanda',
    colors: { primary: '#FF0000', secondary: '#000000' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Zimbabwe',
    nameAr: 'زيمبابوي',
    nameFr: 'Zimbabwe',
    slug: 'zimbabwe',
    shortCode: 'ZIM',
    flagUrl: 'https://flagcdn.com/w320/zw.png',
    group: 'B',
    city: 'Harare',
    cityAr: 'هراري',
    cityFr: 'Harare',
    colors: { primary: '#FFD700', secondary: '#008000' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },

  // Group C
  {
    name: 'Nigeria',
    nameAr: 'نيجيريا',
    nameFr: 'Nigéria',
    slug: 'nigeria',
    shortCode: 'NGA',
    flagUrl: 'https://flagcdn.com/w320/ng.png',
    group: 'C',
    city: 'Abuja',
    cityAr: 'أبوجا',
    cityFr: 'Abuja',
    colors: { primary: '#008751', secondary: '#FFFFFF' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Tunisia',
    nameAr: 'تونس',
    nameFr: 'Tunisie',
    slug: 'tunisia',
    shortCode: 'TUN',
    flagUrl: 'https://flagcdn.com/w320/tn.png',
    group: 'C',
    city: 'Tunis',
    cityAr: 'تونس',
    cityFr: 'Tunis',
    colors: { primary: '#E70013', secondary: '#FFFFFF' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Uganda',
    nameAr: 'أوغندا',
    nameFr: 'Ouganda',
    slug: 'uganda',
    shortCode: 'UGA',
    flagUrl: 'https://flagcdn.com/w320/ug.png',
    group: 'C',
    city: 'Kampala',
    cityAr: 'كمبالا',
    cityFr: 'Kampala',
    colors: { primary: '#FFD700', secondary: '#000000' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Tanzania',
    nameAr: 'تنزانيا',
    nameFr: 'Tanzanie',
    slug: 'tanzania',
    shortCode: 'TAN',
    flagUrl: 'https://flagcdn.com/w320/tz.png',
    group: 'C',
    city: 'Dodoma',
    cityAr: 'دودوما',
    cityFr: 'Dodoma',
    colors: { primary: '#00A651', secondary: '#FFCD00' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },

  // Group D
  {
    name: 'Senegal',
    nameAr: 'السنغال',
    nameFr: 'Sénégal',
    slug: 'senegal',
    shortCode: 'SEN',
    flagUrl: 'https://flagcdn.com/w320/sn.png',
    group: 'D',
    city: 'Dakar',
    cityAr: 'داكار',
    cityFr: 'Dakar',
    colors: { primary: '#00853F', secondary: '#FFD700' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'DR Congo',
    nameAr: 'جمهورية الكونغو الديمقراطية',
    nameFr: 'RD Congo',
    slug: 'dr-congo',
    shortCode: 'COD',
    flagUrl: 'https://flagcdn.com/w320/cd.png',
    group: 'D',
    city: 'Kinshasa',
    cityAr: 'كينشاسا',
    cityFr: 'Kinshasa',
    colors: { primary: '#007FFF', secondary: '#FF0000' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Benin',
    nameAr: 'بنين',
    nameFr: 'Bénin',
    slug: 'benin',
    shortCode: 'BEN',
    flagUrl: 'https://flagcdn.com/w320/bj.png',
    group: 'D',
    city: 'Porto-Novo',
    cityAr: 'بورتو نوفو',
    cityFr: 'Porto-Novo',
    colors: { primary: '#008751', secondary: '#FFD700' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Botswana',
    nameAr: 'بوتسوانا',
    nameFr: 'Botswana',
    slug: 'botswana',
    shortCode: 'BOT',
    flagUrl: 'https://flagcdn.com/w320/bw.png',
    group: 'D',
    city: 'Gaborone',
    cityAr: 'جابورون',
    cityFr: 'Gaborone',
    colors: { primary: '#00A651', secondary: '#FFFFFF' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },

  // Group E
  {
    name: 'Algeria',
    nameAr: 'الجزائر',
    nameFr: 'Algérie',
    slug: 'algeria',
    shortCode: 'ALG',
    flagUrl: 'https://flagcdn.com/w320/dz.png',
    group: 'E',
    city: 'Algiers',
    cityAr: 'الجزائر',
    cityFr: 'Alger',
    colors: { primary: '#008000', secondary: '#FFFFFF' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Burkina Faso',
    nameAr: 'بوركينا فاسو',
    nameFr: 'Burkina Faso',
    slug: 'burkina-faso',
    shortCode: 'BFA',
    flagUrl: 'https://flagcdn.com/w320/bf.png',
    group: 'E',
    city: 'Ouagadougou',
    cityAr: 'واغادوغو',
    cityFr: 'Ouagadougou',
    colors: { primary: '#008751', secondary: '#FFD700' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Equatorial Guinea',
    nameAr: 'غينيا الاستوائية',
    nameFr: 'Guinée Équatoriale',
    slug: 'equatorial-guinea',
    shortCode: 'EQG',
    flagUrl: 'https://flagcdn.com/w320/gq.png',
    group: 'E',
    city: 'Malabo',
    cityAr: 'مالابو',
    cityFr: 'Malabo',
    colors: { primary: '#008000', secondary: '#FF0000' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Sudan',
    nameAr: 'السودان',
    nameFr: 'Soudan',
    slug: 'sudan',
    shortCode: 'SDN',
    flagUrl: 'https://flagcdn.com/w320/sd.png',
    group: 'E',
    city: 'Khartoum',
    cityAr: 'الخرطوم',
    cityFr: 'Khartoum',
    colors: { primary: '#FF0000', secondary: '#000000' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },

  // Group F
  {
    name: 'Ivory Coast',
    nameAr: 'ساحل العاج',
    nameFr: "Côte d'Ivoire",
    slug: 'ivory-coast',
    shortCode: 'CIV',
    flagUrl: 'https://flagcdn.com/w320/ci.png',
    group: 'F',
    city: 'Yamoussoukro',
    cityAr: 'ياموسوكرو',
    cityFr: 'Yamoussoukro',
    colors: { primary: '#FF8C00', secondary: '#FFFFFF' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Cameroon',
    nameAr: 'الكاميرون',
    nameFr: 'Cameroun',
    slug: 'cameroon',
    shortCode: 'CMR',
    flagUrl: 'https://flagcdn.com/w320/cm.png',
    group: 'F',
    city: 'Yaoundé',
    cityAr: 'ياوندي',
    cityFr: 'Yaoundé',
    colors: { primary: '#007A4D', secondary: '#FFD700' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Gabon',
    nameAr: 'الغابون',
    nameFr: 'Gabon',
    slug: 'gabon',
    shortCode: 'GAB',
    flagUrl: 'https://flagcdn.com/w320/ga.png',
    group: 'F',
    city: 'Libreville',
    cityAr: 'ليبرفيل',
    cityFr: 'Libreville',
    colors: { primary: '#008751', secondary: '#FFD700' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
  {
    name: 'Mozambique',
    nameAr: 'موزمبيق',
    nameFr: 'Mozambique',
    slug: 'mozambique',
    shortCode: 'MOZ',
    flagUrl: 'https://flagcdn.com/w320/mz.png',
    group: 'F',
    city: 'Maputo',
    cityAr: 'مابوتو',
    cityFr: 'Maputo',
    colors: { primary: '#008000', secondary: '#FFD700' },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
  },
];

// AFCON 2025 Stadiums Data
const stadiumsData = [
  {
    name: 'Prince Moulay Abdellah Stadium',
    nameAr: 'ملعب الأمير مولاي عبد الله',
    nameFr: 'Stade Prince Moulay Abdellah',
    shortName: 'Prince Moulay Abdellah',
    slug: 'prince-moulay-abdellah-stadium',
    city: 'Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    location: {
      type: 'Point' as const,
      coordinates: [-6.8498, 33.9723],
    },
    address: 'Avenue Ibn Sina, Rabat',
    addressAr: 'شارع ابن سينا، الرباط',
    addressFr: 'Avenue Ibn Sina, Rabat',
    capacity: 68700,
    opened: 1983,
    surface: 'Grass',
    facilities: ['Parking', 'VIP Boxes', 'Food Courts', 'Wheelchair Access'],
    transport: ['Bus', 'Taxi', 'Tram'],
    nearbyAttractions: ['Royal Palace', 'Kasbah of the Udayas', 'Chellah'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
  {
    name: 'Moulay Hassan Stadium',
    nameAr: 'ملعب مولاي الحسن',
    nameFr: 'Stade Moulay Hassan',
    shortName: 'Moulay Hassan',
    slug: 'moulay-hassan-stadium',
    city: 'Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    location: {
      type: 'Point' as const,
      coordinates: [-6.851, 33.972],
    },
    address: 'Avenue Al Massira, Rabat',
    addressAr: 'شارع الماسيرة، الرباط',
    addressFr: 'Avenue Al Massira, Rabat',
    capacity: 22000,
    opened: 2019,
    surface: 'Grass',
    facilities: ['Parking', 'Food Courts', 'Wheelchair Access'],
    transport: ['Bus', 'Taxi', 'Tram'],
    nearbyAttractions: ['Rabat-Salé Tramway', 'Andalusian Gardens'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
  {
    name: 'Rabat Olympic Stadium',
    nameAr: 'الملعب الأولمبي بالرباط',
    nameFr: 'Stade Olympique de Rabat',
    shortName: 'Olympic Stadium',
    slug: 'rabat-olympic-stadium',
    city: 'Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    location: {
      type: 'Point' as const,
      coordinates: [-6.849, 33.973],
    },
    address: 'Complexe Sportif Moulay Abdellah, Rabat',
    addressAr: 'المجمع الرياضي مولاي عبد الله، الرباط',
    addressFr: 'Complexe Sportif Moulay Abdellah, Rabat',
    capacity: 21000,
    opened: 1968,
    surface: 'Grass',
    facilities: ['Parking', 'Athletics Track', 'Food Courts'],
    transport: ['Bus', 'Taxi'],
    nearbyAttractions: ['National Museum', 'Hassan Tower'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: false,
    },
  },
  {
    name: 'Al Barid Stadium',
    nameAr: 'ملعب البريد',
    nameFr: 'Stade Al Barid',
    shortName: 'Al Barid',
    slug: 'al-barid-stadium',
    city: 'Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    location: {
      type: 'Point' as const,
      coordinates: [-6.8505, 33.9715],
    },
    address: 'Avenue Al Irfane, Rabat',
    addressAr: 'شارع العرفان، الرباط',
    addressFr: 'Avenue Al Irfane, Rabat',
    capacity: 18000,
    opened: 2019,
    surface: 'Grass',
    facilities: ['Parking', 'Food Courts', 'Wheelchair Access'],
    transport: ['Bus', 'Taxi'],
    nearbyAttractions: ['Mohammed V University', 'Rabat Zoo'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
  {
    name: 'Stade Mohammed V',
    nameAr: 'ملعب محمد الخامس',
    nameFr: 'Stade Mohammed V',
    shortName: 'Mohammed V',
    slug: 'stade-mohammed-v',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    cityFr: 'Casablanca',
    location: {
      type: 'Point' as const,
      coordinates: [-7.6298, 33.5731],
    },
    address: 'Avenue Moulay Rachid, Casablanca',
    addressAr: 'شارع مولاي رشيد، الدار البيضاء',
    addressFr: 'Avenue Moulay Rachid, Casablanca',
    capacity: 45000,
    opened: 1955,
    surface: 'Grass',
    facilities: ['Parking', 'VIP Boxes', 'Food Courts', 'Wheelchair Access'],
    transport: ['Bus', 'Taxi', 'Tram'],
    nearbyAttractions: [
      'Hassan II Mosque',
      'Corniche Ain Diab',
      'Morocco Mall',
    ],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
  {
    name: 'Adrar Stadium',
    nameAr: 'ملعب أدرار',
    nameFr: 'Stade Adrar',
    shortName: 'Adrar',
    slug: 'adrar-stadium',
    city: 'Agadir',
    cityAr: 'أكادير',
    cityFr: 'Agadir',
    location: {
      type: 'Point' as const,
      coordinates: [-9.5981, 30.4278],
    },
    address: 'Boulevard du Prince Moulay Abdellah, Agadir',
    addressAr: 'بوليفار الأمير مولاي عبد الله، أكادير',
    addressFr: 'Boulevard du Prince Moulay Abdellah, Agadir',
    capacity: 45000,
    opened: 2013,
    surface: 'Grass',
    facilities: ['Parking', 'VIP Boxes', 'Food Courts', 'Wheelchair Access'],
    transport: ['Bus', 'Taxi'],
    nearbyAttractions: ['Agadir Beach', 'Souk El Had', 'Valley of the Birds'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
  {
    name: 'Fez Stadium',
    nameAr: 'ملعب فاس',
    nameFr: 'Stade de Fès',
    shortName: 'Fez Stadium',
    slug: 'fez-stadium',
    city: 'Fez',
    cityAr: 'فاس',
    cityFr: 'Fès',
    location: {
      type: 'Point' as const,
      coordinates: [-4.9688, 34.0028],
    },
    address: "Route d'Imouzzer, Fez",
    addressAr: 'طريق إموزار، فاس',
    addressFr: "Route d'Imouzzer, Fès",
    capacity: 45000,
    opened: 2007,
    surface: 'Grass',
    facilities: ['Parking', 'VIP Boxes', 'Food Courts', 'Wheelchair Access'],
    transport: ['Bus', 'Taxi'],
    nearbyAttractions: [
      'Medina of Fez',
      'Bou Inania Madrasa',
      'Chouara Tannery',
    ],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
  {
    name: 'Marrakesh Stadium',
    nameAr: 'ملعب مراكش',
    nameFr: 'Stade de Marrakech',
    shortName: 'Marrakesh Stadium',
    slug: 'marrakesh-stadium',
    city: 'Marrakesh',
    cityAr: 'مراكش',
    cityFr: 'Marrakech',
    location: {
      type: 'Point' as const,
      coordinates: [-7.975, 31.704],
    },
    address: 'Route de Safi, Marrakesh',
    addressAr: 'طريق الصفي، مراكش',
    addressFr: 'Route de Safi, Marrakech',
    capacity: 45000,
    opened: 2011,
    surface: 'Grass',
    facilities: ['Parking', 'VIP Boxes', 'Food Courts', 'Wheelchair Access'],
    transport: ['Bus', 'Taxi'],
    nearbyAttractions: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Bahia Palace'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
  {
    name: 'Ibn Batouta Stadium',
    nameAr: 'ملعب ابن بطوطة',
    nameFr: 'Stade Ibn Batouta',
    shortName: 'Ibn Batouta',
    slug: 'ibn-batouta-stadium',
    city: 'Tangier',
    cityAr: 'طنجة',
    cityFr: 'Tanger',
    location: {
      type: 'Point' as const,
      coordinates: [-5.8337, 35.7595],
    },
    address: 'Route de Tétouan, Tangier',
    addressAr: 'طريق تطوان، طنجة',
    addressFr: 'Route de Tétouan, Tanger',
    capacity: 75000,
    opened: 2011,
    surface: 'Grass',
    facilities: ['Parking', 'VIP Boxes', 'Food Courts', 'Wheelchair Access'],
    transport: ['Bus', 'Taxi'],
    nearbyAttractions: ['Medina of Tangier', 'Cape Spartel', 'Hercules Cave'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
];

// Helper function to get team ID by short code
const getTeamId = (teams: any[], shortCode: string) => {
  const team = teams.find(t => t.shortCode === shortCode);
  return team ? team._id : null;
};

// Helper function to get stadium ID by slug
const getStadiumId = (stadiums: any[], slug: string) => {
  const stadium = stadiums.find(s => s.slug === slug);
  return stadium ? stadium._id : null;
};

// AFCON 2025 Matches Data
const generateMatchesData = (teams: any[], stadiums: any[]) => {
  const matches = [];
  let matchNumber = 1;

  // Group Stage Matches (36 matches)
  // Group A
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'MAR'),
      awayTeam: getTeamId(teams, 'MLI'),
      stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
      stage: 'group',
      group: 'A',
      dateTime: new Date('2025-12-21T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'ZAM'),
      awayTeam: getTeamId(teams, 'COM'),
      stadium: getStadiumId(stadiums, 'moulay-hassan-stadium'),
      stage: 'group',
      group: 'A',
      dateTime: new Date('2025-12-21T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'MLI'),
      awayTeam: getTeamId(teams, 'ZAM'),
      stadium: getStadiumId(stadiums, 'rabat-olympic-stadium'),
      stage: 'group',
      group: 'A',
      dateTime: new Date('2025-12-25T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'COM'),
      awayTeam: getTeamId(teams, 'MAR'),
      stadium: getStadiumId(stadiums, 'al-barid-stadium'),
      stage: 'group',
      group: 'A',
      dateTime: new Date('2025-12-25T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'MAR'),
      awayTeam: getTeamId(teams, 'ZAM'),
      stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
      stage: 'group',
      group: 'A',
      dateTime: new Date('2025-12-29T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'COM'),
      awayTeam: getTeamId(teams, 'MLI'),
      stadium: getStadiumId(stadiums, 'moulay-hassan-stadium'),
      stage: 'group',
      group: 'A',
      dateTime: new Date('2025-12-29T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Group B
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'EGY'),
      awayTeam: getTeamId(teams, 'RSA'),
      stadium: getStadiumId(stadiums, 'stade-mohammed-v'),
      stage: 'group',
      group: 'B',
      dateTime: new Date('2025-12-22T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'ANG'),
      awayTeam: getTeamId(teams, 'ZIM'),
      stadium: getStadiumId(stadiums, 'adrar-stadium'),
      stage: 'group',
      group: 'B',
      dateTime: new Date('2025-12-22T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'RSA'),
      awayTeam: getTeamId(teams, 'ANG'),
      stadium: getStadiumId(stadiums, 'fez-stadium'),
      stage: 'group',
      group: 'B',
      dateTime: new Date('2025-12-26T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'ZIM'),
      awayTeam: getTeamId(teams, 'EGY'),
      stadium: getStadiumId(stadiums, 'marrakesh-stadium'),
      stage: 'group',
      group: 'B',
      dateTime: new Date('2025-12-26T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'EGY'),
      awayTeam: getTeamId(teams, 'ANG'),
      stadium: getStadiumId(stadiums, 'ibn-batouta-stadium'),
      stage: 'group',
      group: 'B',
      dateTime: new Date('2025-12-30T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'ZIM'),
      awayTeam: getTeamId(teams, 'RSA'),
      stadium: getStadiumId(stadiums, 'stade-mohammed-v'),
      stage: 'group',
      group: 'B',
      dateTime: new Date('2025-12-30T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Group C
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'NGA'),
      awayTeam: getTeamId(teams, 'TUN'),
      stadium: getStadiumId(stadiums, 'adrar-stadium'),
      stage: 'group',
      group: 'C',
      dateTime: new Date('2025-12-23T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'UGA'),
      awayTeam: getTeamId(teams, 'TAN'),
      stadium: getStadiumId(stadiums, 'fez-stadium'),
      stage: 'group',
      group: 'C',
      dateTime: new Date('2025-12-23T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'TUN'),
      awayTeam: getTeamId(teams, 'UGA'),
      stadium: getStadiumId(stadiums, 'marrakesh-stadium'),
      stage: 'group',
      group: 'C',
      dateTime: new Date('2025-12-27T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'TAN'),
      awayTeam: getTeamId(teams, 'NGA'),
      stadium: getStadiumId(stadiums, 'ibn-batouta-stadium'),
      stage: 'group',
      group: 'C',
      dateTime: new Date('2025-12-27T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'NGA'),
      awayTeam: getTeamId(teams, 'UGA'),
      stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
      stage: 'group',
      group: 'C',
      dateTime: new Date('2025-12-31T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'TAN'),
      awayTeam: getTeamId(teams, 'TUN'),
      stadium: getStadiumId(stadiums, 'moulay-hassan-stadium'),
      stage: 'group',
      group: 'C',
      dateTime: new Date('2025-12-31T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Group D
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'SEN'),
      awayTeam: getTeamId(teams, 'COD'),
      stadium: getStadiumId(stadiums, 'marrakesh-stadium'),
      stage: 'group',
      group: 'D',
      dateTime: new Date('2025-12-24T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'BEN'),
      awayTeam: getTeamId(teams, 'BOT'),
      stadium: getStadiumId(stadiums, 'ibn-batouta-stadium'),
      stage: 'group',
      group: 'D',
      dateTime: new Date('2025-12-24T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'COD'),
      awayTeam: getTeamId(teams, 'BEN'),
      stadium: getStadiumId(stadiums, 'stade-mohammed-v'),
      stage: 'group',
      group: 'D',
      dateTime: new Date('2025-12-28T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'BOT'),
      awayTeam: getTeamId(teams, 'SEN'),
      stadium: getStadiumId(stadiums, 'adrar-stadium'),
      stage: 'group',
      group: 'D',
      dateTime: new Date('2025-12-28T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'SEN'),
      awayTeam: getTeamId(teams, 'BEN'),
      stadium: getStadiumId(stadiums, 'fez-stadium'),
      stage: 'group',
      group: 'D',
      dateTime: new Date('2026-01-01T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'BOT'),
      awayTeam: getTeamId(teams, 'COD'),
      stadium: getStadiumId(stadiums, 'marrakesh-stadium'),
      stage: 'group',
      group: 'D',
      dateTime: new Date('2026-01-01T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Group E
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'ALG'),
      awayTeam: getTeamId(teams, 'BFA'),
      stadium: getStadiumId(stadiums, 'ibn-batouta-stadium'),
      stage: 'group',
      group: 'E',
      dateTime: new Date('2025-12-25T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'EQG'),
      awayTeam: getTeamId(teams, 'SDN'),
      stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
      stage: 'group',
      group: 'E',
      dateTime: new Date('2025-12-25T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'BFA'),
      awayTeam: getTeamId(teams, 'EQG'),
      stadium: getStadiumId(stadiums, 'moulay-hassan-stadium'),
      stage: 'group',
      group: 'E',
      dateTime: new Date('2025-12-29T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'SDN'),
      awayTeam: getTeamId(teams, 'ALG'),
      stadium: getStadiumId(stadiums, 'rabat-olympic-stadium'),
      stage: 'group',
      group: 'E',
      dateTime: new Date('2025-12-29T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'ALG'),
      awayTeam: getTeamId(teams, 'EQG'),
      stadium: getStadiumId(stadiums, 'al-barid-stadium'),
      stage: 'group',
      group: 'E',
      dateTime: new Date('2026-01-02T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'SDN'),
      awayTeam: getTeamId(teams, 'BFA'),
      stadium: getStadiumId(stadiums, 'stade-mohammed-v'),
      stage: 'group',
      group: 'E',
      dateTime: new Date('2026-01-02T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Group F
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'CIV'),
      awayTeam: getTeamId(teams, 'CMR'),
      stadium: getStadiumId(stadiums, 'fez-stadium'),
      stage: 'group',
      group: 'F',
      dateTime: new Date('2025-12-26T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'GAB'),
      awayTeam: getTeamId(teams, 'MOZ'),
      stadium: getStadiumId(stadiums, 'marrakesh-stadium'),
      stage: 'group',
      group: 'F',
      dateTime: new Date('2025-12-26T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'CMR'),
      awayTeam: getTeamId(teams, 'GAB'),
      stadium: getStadiumId(stadiums, 'ibn-batouta-stadium'),
      stage: 'group',
      group: 'F',
      dateTime: new Date('2025-12-30T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'MOZ'),
      awayTeam: getTeamId(teams, 'CIV'),
      stadium: getStadiumId(stadiums, 'adrar-stadium'),
      stage: 'group',
      group: 'F',
      dateTime: new Date('2025-12-30T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'CIV'),
      awayTeam: getTeamId(teams, 'GAB'),
      stadium: getStadiumId(stadiums, 'fez-stadium'),
      stage: 'group',
      group: 'F',
      dateTime: new Date('2026-01-03T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: getTeamId(teams, 'MOZ'),
      awayTeam: getTeamId(teams, 'CMR'),
      stadium: getStadiumId(stadiums, 'marrakesh-stadium'),
      stage: 'group',
      group: 'F',
      dateTime: new Date('2026-01-03T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Round of 16 (8 matches) - January 5-8, 2026
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
      stage: 'round_of_16',
      dateTime: new Date('2026-01-05T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'moulay-hassan-stadium'),
      stage: 'round_of_16',
      dateTime: new Date('2026-01-05T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'stade-mohammed-v'),
      stage: 'round_of_16',
      dateTime: new Date('2026-01-06T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'adrar-stadium'),
      stage: 'round_of_16',
      dateTime: new Date('2026-01-06T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'fez-stadium'),
      stage: 'round_of_16',
      dateTime: new Date('2026-01-07T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'marrakesh-stadium'),
      stage: 'round_of_16',
      dateTime: new Date('2026-01-07T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'ibn-batouta-stadium'),
      stage: 'round_of_16',
      dateTime: new Date('2026-01-08T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
      stage: 'round_of_16',
      dateTime: new Date('2026-01-08T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Quarter-finals (4 matches) - January 10-12, 2026
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'stade-mohammed-v'),
      stage: 'quarter_final',
      dateTime: new Date('2026-01-10T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'adrar-stadium'),
      stage: 'quarter_final',
      dateTime: new Date('2026-01-10T21:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'ibn-batouta-stadium'),
      stage: 'quarter_final',
      dateTime: new Date('2026-01-12T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
      stage: 'quarter_final',
      dateTime: new Date('2026-01-12T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Semi-finals (2 matches) - January 15, 2026
  matches.push(
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'ibn-batouta-stadium'),
      stage: 'semi_final',
      dateTime: new Date('2026-01-15T18:00:00Z'),
      status: 'scheduled',
    },
    {
      matchNumber: matchNumber++,
      homeTeam: null,
      awayTeam: null,
      stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
      stage: 'semi_final',
      dateTime: new Date('2026-01-15T21:00:00Z'),
      status: 'scheduled',
    }
  );

  // Third place match - January 17, 2026
  matches.push({
    matchNumber: matchNumber++,
    homeTeam: null,
    awayTeam: null,
    stadium: getStadiumId(stadiums, 'marrakesh-stadium'),
    stage: 'third_place',
    dateTime: new Date('2026-01-17T18:00:00Z'),
    status: 'scheduled',
  });

  // Final - January 18, 2026
  matches.push({
    matchNumber: matchNumber++,
    homeTeam: null,
    awayTeam: null,
    stadium: getStadiumId(stadiums, 'prince-moulay-abdellah-stadium'),
    stage: 'final',
    dateTime: new Date('2026-01-18T20:00:00Z'),
    status: 'scheduled',
  });

  return matches;
};

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to database');

    console.log('Clearing existing data...');
    await Stadium.deleteMany({});
    await Team.deleteMany({});
    await Match.deleteMany({});
    console.log('✅ Cleared existing data');

    console.log('Seeding stadiums...');
    const stadiums = await Stadium.insertMany(stadiumsData);
    console.log(`✅ Seeded ${stadiums.length} stadiums`);

    console.log('Seeding teams...');
    const teams = await Team.insertMany(teamsData);
    console.log(`✅ Seeded ${teams.length} teams`);

    console.log('Generating matches...');
    const matchesData = generateMatchesData(teams, stadiums);
    const matches = await Match.insertMany(matchesData);
    console.log(`✅ Seeded ${matches.length} matches`);

    console.log('Indexes are automatically created by Mongoose...');
    console.log('✅ Indexes management completed');

    console.log('🎉 AFCON 2025 seed completed successfully!');
    console.log(
      `📊 Summary: ${teams.length} teams, ${stadiums.length} stadiums, ${matches.length} matches`
    );

    // Verify data integrity
    console.log('🔍 Verifying data integrity...');

    // Check all team IDs in matches exist
    const matchTeamIds = [
      ...new Set(
        matches.flatMap(m => [m.homeTeam, m.awayTeam].filter(Boolean))
      ),
    ];
    const existingTeamIds = teams.map(t => (t._id as any).toString());
    const invalidTeamIds = matchTeamIds.filter(
      id => !existingTeamIds.includes(id.toString())
    );

    if (invalidTeamIds.length > 0) {
      console.warn(
        `⚠️  Found ${invalidTeamIds.length} invalid team references in matches`
      );
    }

    // Check all stadium IDs in matches exist
    const matchStadiumIds = [
      ...new Set(matches.map(m => m.stadium).filter(Boolean)),
    ];
    const existingStadiumIds = stadiums.map(s => (s._id as any).toString());
    const invalidStadiumIds = matchStadiumIds.filter(
      id => !existingStadiumIds.includes(id.toString())
    );

    if (invalidStadiumIds.length > 0) {
      console.warn(
        `⚠️  Found ${invalidStadiumIds.length} invalid stadium references in matches`
      );
    }

    // Check match dates are within tournament period
    const tournamentStart = new Date('2025-12-21');
    const tournamentEnd = new Date('2026-01-18');
    const invalidDates = matches.filter(
      m => m.dateTime < tournamentStart || m.dateTime > tournamentEnd
    );

    if (invalidDates.length > 0) {
      console.warn(
        `⚠️  Found ${invalidDates.length} matches with dates outside tournament period`
      );
    }

    // Check for duplicate match numbers
    const matchNumbers = matches.map(m => m.matchNumber);
    const duplicateNumbers = matchNumbers.filter(
      (num, index) => matchNumbers.indexOf(num) !== index
    );

    if (duplicateNumbers.length > 0) {
      console.warn(
        `⚠️  Found duplicate match numbers: ${[...new Set(duplicateNumbers)]}`
      );
    }

    console.log('✅ Data integrity verification completed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
