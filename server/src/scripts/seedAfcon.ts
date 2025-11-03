import mongoose from 'mongoose';
import { config } from '../config';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';
import { Match } from '../models/Match';

const stadiumsData = [
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
      coordinates: [-7.6719, 33.5731],
    },
    address: 'Avenue Moulay Rachid, Casablanca',
    addressAr: 'شارع مولاي رشيد، الدار البيضاء',
    addressFr: 'Avenue Moulay Rachid, Casablanca',
    capacity: 45891,
    opened: 1955,
    surface: 'Grass',
    images: [],
    facilities: ['VIP Boxes', 'Press Center', 'Medical Center', 'Parking'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
    transport: [
      {
        type: 'Metro',
        description: 'Casa Tramway Line T1',
        descriptionAr: 'ترامواي الدار البيضاء الخط T1',
        descriptionFr: 'Tramway de Casablanca Ligne T1',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Hassan II Mosque',
        nameAr: 'مسجد الحسن الثاني',
        nameFr: 'Mosquée Hassan II',
        description: 'Iconic mosque by the sea',
        descriptionAr: 'مسجد أيقوني على البحر',
        descriptionFr: 'Mosquée emblématique au bord de la mer',
        distance: 5.2,
      },
    ],
  },
  {
    name: 'Stade Prince Moulay Abdellah',
    nameAr: 'ملعب الأمير مولاي عبد الله',
    nameFr: 'Stade Prince Moulay Abdellah',
    shortName: 'Prince Moulay Abdellah',
    slug: 'stade-prince-moulay-abdellah',
    city: 'Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    location: {
      type: 'Point' as const,
      coordinates: [-6.8498, 33.9716],
    },
    address: 'Avenue Ibn Sina, Rabat',
    addressAr: 'شارع ابن سينا، الرباط',
    addressFr: 'Avenue Ibn Sina, Rabat',
    capacity: 52000,
    opened: 1983,
    surface: 'Grass',
    images: [],
    facilities: ['Athletics Track', 'VIP Boxes', 'Press Center', 'Parking'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
    transport: [
      {
        type: 'Bus',
        description: 'Multiple bus lines to city center',
        descriptionAr: 'خطوط حافلات متعددة إلى وسط المدينة',
        descriptionFr: 'Plusieurs lignes de bus vers le centre-ville',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Kasbah of the Udayas',
        nameAr: 'قصبة الأوداية',
        nameFr: 'Kasbah des Oudayas',
        description: 'Historic fortress',
        descriptionAr: 'قلعة تاريخية',
        descriptionFr: 'Forteresse historique',
        distance: 7.5,
      },
    ],
  },
  {
    name: 'Stade Adrar',
    nameAr: 'ملعب أدرار',
    nameFr: 'Stade Adrar',
    shortName: 'Adrar',
    slug: 'stade-adrar',
    city: 'Agadir',
    cityAr: 'أكادير',
    cityFr: 'Agadir',
    location: {
      type: 'Point' as const,
      coordinates: [-9.5981, 30.3925],
    },
    address: 'Boulevard Mohammed V, Agadir',
    addressAr: 'شارع محمد الخامس، أكادير',
    addressFr: 'Boulevard Mohammed V, Agadir',
    capacity: 45480,
    opened: 2013,
    surface: 'Grass',
    images: [],
    facilities: ['Modern Facilities', 'VIP Boxes', 'Press Center', 'Parking'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
    transport: [
      {
        type: 'Taxi',
        description: 'Taxi services available',
        descriptionAr: 'خدمات سيارات الأجرة متوفرة',
        descriptionFr: 'Services de taxi disponibles',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Agadir Beach',
        nameAr: 'شاطئ أكادير',
        nameFr: "Plage d'Agadir",
        description: 'Beautiful Atlantic beach',
        descriptionAr: 'شاطئ أطلسي جميل',
        descriptionFr: 'Belle plage atlantique',
        distance: 3.8,
      },
    ],
  },
  {
    name: 'Stade de Marrakech',
    nameAr: 'ملعب مراكش',
    nameFr: 'Stade de Marrakech',
    shortName: 'Marrakech',
    slug: 'stade-marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    cityFr: 'Marrakech',
    location: {
      type: 'Point' as const,
      coordinates: [-8.0089, 31.6295],
    },
    address: 'Route de Casablanca, Marrakech',
    addressAr: 'طريق الدار البيضاء، مراكش',
    addressFr: 'Route de Casablanca, Marrakech',
    capacity: 45240,
    opened: 2011,
    surface: 'Grass',
    images: [],
    facilities: ['VIP Boxes', 'Press Center', 'Medical Center', 'Parking'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
    transport: [
      {
        type: 'Bus',
        description: 'City bus service',
        descriptionAr: 'خدمة الحافلات المدينة',
        descriptionFr: 'Service de bus urbain',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Jemaa el-Fnaa',
        nameAr: 'ساحة جامع الفنا',
        nameFr: 'Place Jemaa el-Fnaa',
        description: 'Historic market square',
        descriptionAr: 'ساحة السوق التاريخية',
        descriptionFr: 'Place de marché historique',
        distance: 5.5,
      },
    ],
  },
  {
    name: 'Stade de Fès',
    nameAr: 'ملعب فاس',
    nameFr: 'Stade de Fès',
    shortName: 'Fès',
    slug: 'stade-fes',
    city: 'Fès',
    cityAr: 'فاس',
    cityFr: 'Fès',
    location: {
      type: 'Point' as const,
      coordinates: [-4.9998, 34.0331],
    },
    address: "Route d'Imouzzer, Fès",
    addressAr: 'طريق إموزر، فاس',
    addressFr: "Route d'Imouzzer, Fès",
    capacity: 45000,
    opened: 2003,
    surface: 'Grass',
    images: [],
    facilities: ['VIP Boxes', 'Press Center', 'Parking'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
    transport: [
      {
        type: 'Taxi',
        description: 'Grand taxis and petits taxis',
        descriptionAr: 'سيارات الأجرة الكبيرة والصغيرة',
        descriptionFr: 'Grands taxis et petits taxis',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Fès el-Bali',
        nameAr: 'فاس البالي',
        nameFr: 'Fès el-Bali',
        description: 'UNESCO World Heritage medina',
        descriptionAr: 'المدينة القديمة المدرجة في اليونسكو',
        descriptionFr: 'Médina classée au patrimoine mondial',
        distance: 4.2,
      },
    ],
  },
  {
    name: 'Stade de Tanger',
    nameAr: 'ملعب طنجة',
    nameFr: 'Stade de Tanger',
    shortName: 'Tanger',
    slug: 'stade-tanger',
    city: 'Tangier',
    cityAr: 'طنجة',
    cityFr: 'Tanger',
    location: {
      type: 'Point' as const,
      coordinates: [-5.8135, 35.7595],
    },
    address: 'Avenue des FAR, Tanger',
    addressAr: 'شارع القوات المسلحة الملكية، طنجة',
    addressFr: 'Avenue des FAR, Tanger',
    capacity: 65000,
    opened: 2011,
    surface: 'Grass',
    images: [],
    facilities: [
      'State-of-the-art facilities',
      'VIP Boxes',
      'Press Center',
      'Parking',
    ],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
    transport: [
      {
        type: 'Bus',
        description: 'City bus network',
        descriptionAr: 'شبكة حافلات المدينة',
        descriptionFr: 'Réseau de bus urbain',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Cap Spartel',
        nameAr: 'رأس سبارطيل',
        nameFr: 'Cap Spartel',
        description: 'Scenic cape with lighthouse',
        descriptionAr: 'رأس خلاب مع منارة',
        descriptionFr: 'Cap pittoresque avec phare',
        distance: 12.5,
      },
    ],
  },
  {
    name: 'Stade Municipal de Meknès',
    nameAr: 'الملعب البلدي لمكناس',
    nameFr: 'Stade Municipal de Meknès',
    shortName: 'Meknès',
    slug: 'stade-meknes',
    city: 'Meknès',
    cityAr: 'مكناس',
    cityFr: 'Meknès',
    location: {
      type: 'Point' as const,
      coordinates: [-5.5471, 33.8935],
    },
    address: 'Avenue Moulay Ismail, Meknès',
    addressAr: 'شارع مولاي إسماعيل، مكناس',
    addressFr: 'Avenue Moulay Ismail, Meknès',
    capacity: 30000,
    opened: 1962,
    surface: 'Grass',
    images: [],
    facilities: ['VIP Boxes', 'Press Center', 'Parking'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: false,
    },
    transport: [
      {
        type: 'Taxi',
        description: 'Taxi services',
        descriptionAr: 'خدمات سيارات الأجرة',
        descriptionFr: 'Services de taxi',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Bab Mansour',
        nameAr: 'باب المنصور',
        nameFr: 'Bab Mansour',
        description: 'Historic city gate',
        descriptionAr: 'بوابة المدينة التاريخية',
        descriptionFr: 'Porte historique de la ville',
        distance: 2.1,
      },
    ],
  },
  {
    name: "Stade Municipal d'Oujda",
    nameAr: 'الملعب البلدي لوجدة',
    nameFr: "Stade Municipal d'Oujda",
    shortName: 'Oujda',
    slug: 'stade-oujda',
    city: 'Oujda',
    cityAr: 'وجدة',
    cityFr: 'Oujda',
    location: {
      type: 'Point' as const,
      coordinates: [-1.9084, 34.6867],
    },
    address: 'Boulevard Allal Ben Abdellah, Oujda',
    addressAr: 'شارع علال بن عبد الله، وجدة',
    addressFr: 'Boulevard Allal Ben Abdellah, Oujda',
    capacity: 28000,
    opened: 1976,
    surface: 'Grass',
    images: [],
    facilities: ['VIP Boxes', 'Press Center', 'Parking'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: false,
    },
    transport: [
      {
        type: 'Bus',
        description: 'Local bus service',
        descriptionAr: 'خدمة الحافلات المحلية',
        descriptionFr: 'Service de bus local',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Parc Lalla Aicha',
        nameAr: 'حديقة لالة عائشة',
        nameFr: 'Parc Lalla Aicha',
        description: 'City park',
        descriptionAr: 'حديقة المدينة',
        descriptionFr: 'Parc de la ville',
        distance: 1.8,
      },
    ],
  },
  {
    name: 'Grand Stade de Tétouan',
    nameAr: 'الملعب الكبير لتطوان',
    nameFr: 'Grand Stade de Tétouan',
    shortName: 'Tétouan',
    slug: 'stade-tetouan',
    city: 'Tétouan',
    cityAr: 'تطوان',
    cityFr: 'Tétouan',
    location: {
      type: 'Point' as const,
      coordinates: [-5.3684, 35.5785],
    },
    address: 'Avenue Hassan II, Tétouan',
    addressAr: 'شارع الحسن الثاني، تطوان',
    addressFr: 'Avenue Hassan II, Tétouan',
    capacity: 11000,
    opened: 1960,
    surface: 'Grass',
    images: [],
    facilities: ['Press Center', 'Parking'],
    accessibility: {
      parking: true,
      publicTransport: false,
      wheelchairAccessible: false,
    },
    transport: [
      {
        type: 'Taxi',
        description: 'Taxi service from city center',
        descriptionAr: 'خدمة سيارات الأجرة من وسط المدينة',
        descriptionFr: 'Service de taxi depuis le centre-ville',
      },
    ],
    nearbyAttractions: [
      {
        name: 'Tétouan Medina',
        nameAr: 'مدينة تطوان القديمة',
        nameFr: 'Médina de Tétouan',
        description: 'UNESCO World Heritage site',
        descriptionAr: 'موقع التراث العالمي لليونسكو',
        descriptionFr: "Site du patrimoine mondial de l'UNESCO",
        distance: 2.5,
      },
    ],
  },
];

const teamsData = [
  // Group A
  {
    name: 'Morocco',
    nameAr: 'المغرب',
    nameFr: 'Maroc',
    slug: 'morocco',
    shortCode: 'MAR',
    flag: 'https://flagcdn.com/w320/ma.png',
    logo: 'https://flagcdn.com/w320/ma.png',
    group: 'A' as const,
    city: 'Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    founded: 1955,
    colors: { primary: '#C1272D', secondary: '#006233' },
    league: 'CAF',
  },
  {
    name: 'Egypt',
    nameAr: 'مصر',
    nameFr: 'Égypte',
    slug: 'egypt',
    shortCode: 'EGY',
    flag: 'https://flagcdn.com/w320/eg.png',
    logo: 'https://flagcdn.com/w320/eg.png',
    group: 'A' as const,
    city: 'Cairo',
    cityAr: 'القاهرة',
    cityFr: 'Le Caire',
    founded: 1921,
    colors: { primary: '#CE1126', secondary: '#FFFFFF' },
    league: 'CAF',
  },
  {
    name: 'Ghana',
    nameAr: 'غانا',
    nameFr: 'Ghana',
    slug: 'ghana',
    shortCode: 'GHA',
    flag: 'https://flagcdn.com/w320/gh.png',
    logo: 'https://flagcdn.com/w320/gh.png',
    group: 'A' as const,
    city: 'Accra',
    cityAr: 'أكرا',
    cityFr: 'Accra',
    founded: 1957,
    colors: { primary: '#006B3F', secondary: '#FCD116' },
    league: 'CAF',
  },
  {
    name: 'Tanzania',
    nameAr: 'تنزانيا',
    nameFr: 'Tanzanie',
    slug: 'tanzania',
    shortCode: 'TAN',
    flag: 'https://flagcdn.com/w320/tz.png',
    logo: 'https://flagcdn.com/w320/tz.png',
    group: 'A' as const,
    city: 'Dar es Salaam',
    cityAr: 'دار السلام',
    cityFr: 'Dar es Salaam',
    founded: 1930,
    colors: { primary: '#1EB53A', secondary: '#00A3DD' },
    league: 'CAF',
  },
  // Group B
  {
    name: 'Senegal',
    nameAr: 'السنغال',
    nameFr: 'Sénégal',
    slug: 'senegal',
    shortCode: 'SEN',
    flag: 'https://flagcdn.com/w320/sn.png',
    logo: 'https://flagcdn.com/w320/sn.png',
    group: 'B' as const,
    city: 'Dakar',
    cityAr: 'داكار',
    cityFr: 'Dakar',
    founded: 1960,
    colors: { primary: '#00853F', secondary: '#FDEF42' },
    league: 'CAF',
  },
  {
    name: 'Algeria',
    nameAr: 'الجزائر',
    nameFr: 'Algérie',
    slug: 'algeria',
    shortCode: 'ALG',
    flag: 'https://flagcdn.com/w320/dz.png',
    logo: 'https://flagcdn.com/w320/dz.png',
    group: 'B' as const,
    city: 'Algiers',
    cityAr: 'الجزائر',
    cityFr: 'Alger',
    founded: 1962,
    colors: { primary: '#006233', secondary: '#D21034' },
    league: 'CAF',
  },
  {
    name: 'Burkina Faso',
    nameAr: 'بوركينا فاسو',
    nameFr: 'Burkina Faso',
    slug: 'burkina-faso',
    shortCode: 'BFA',
    flag: 'https://flagcdn.com/w320/bf.png',
    logo: 'https://flagcdn.com/w320/bf.png',
    group: 'B' as const,
    city: 'Ouagadougou',
    cityAr: 'واغادوغو',
    cityFr: 'Ouagadougou',
    founded: 1960,
    colors: { primary: '#EF2B2D', secondary: '#009E49' },
    league: 'CAF',
  },
  {
    name: 'South Africa',
    nameAr: 'جنوب أفريقيا',
    nameFr: 'Afrique du Sud',
    slug: 'south-africa',
    shortCode: 'RSA',
    flag: 'https://flagcdn.com/w320/za.png',
    logo: 'https://flagcdn.com/w320/za.png',
    group: 'B' as const,
    city: 'Johannesburg',
    cityAr: 'جوهانسبرغ',
    cityFr: 'Johannesburg',
    founded: 1992,
    colors: { primary: '#007A4D', secondary: '#FFB81C' },
    league: 'CAF',
  },
  // Group C
  {
    name: 'Nigeria',
    nameAr: 'نيجيريا',
    nameFr: 'Nigeria',
    slug: 'nigeria',
    shortCode: 'NGA',
    flag: 'https://flagcdn.com/w320/ng.png',
    logo: 'https://flagcdn.com/w320/ng.png',
    group: 'C' as const,
    city: 'Abuja',
    cityAr: 'أبوجا',
    cityFr: 'Abuja',
    founded: 1945,
    colors: { primary: '#008751', secondary: '#FFFFFF' },
    league: 'CAF',
  },
  {
    name: 'Ivory Coast',
    nameAr: 'ساحل العاج',
    nameFr: "Côte d'Ivoire",
    slug: 'ivory-coast',
    shortCode: 'CIV',
    flag: 'https://flagcdn.com/w320/ci.png',
    logo: 'https://flagcdn.com/w320/ci.png',
    group: 'C' as const,
    city: 'Abidjan',
    cityAr: 'أبيدجان',
    cityFr: 'Abidjan',
    founded: 1960,
    colors: { primary: '#F77F00', secondary: '#009E60' },
    league: 'CAF',
  },
  {
    name: 'Cameroon',
    nameAr: 'الكاميرون',
    nameFr: 'Cameroun',
    slug: 'cameroon',
    shortCode: 'CMR',
    flag: 'https://flagcdn.com/w320/cm.png',
    logo: 'https://flagcdn.com/w320/cm.png',
    group: 'C' as const,
    city: 'Yaoundé',
    cityAr: 'ياوندي',
    cityFr: 'Yaoundé',
    founded: 1959,
    colors: { primary: '#007A5E', secondary: '#CE1126' },
    league: 'CAF',
  },
  {
    name: 'Zimbabwe',
    nameAr: 'زيمبابوي',
    nameFr: 'Zimbabwe',
    slug: 'zimbabwe',
    shortCode: 'ZIM',
    flag: 'https://flagcdn.com/w320/zw.png',
    logo: 'https://flagcdn.com/w320/zw.png',
    group: 'C' as const,
    city: 'Harare',
    cityAr: 'هراري',
    cityFr: 'Harare',
    founded: 1965,
    colors: { primary: '#319E48', secondary: '#FFD100' },
    league: 'CAF',
  },
  // Group D
  {
    name: 'Tunisia',
    nameAr: 'تونس',
    nameFr: 'Tunisie',
    slug: 'tunisia',
    shortCode: 'TUN',
    flag: 'https://flagcdn.com/w320/tn.png',
    logo: 'https://flagcdn.com/w320/tn.png',
    group: 'D' as const,
    city: 'Tunis',
    cityAr: 'تونس',
    cityFr: 'Tunis',
    founded: 1957,
    colors: { primary: '#E70013', secondary: '#FFFFFF' },
    league: 'CAF',
  },
  {
    name: 'Mali',
    nameAr: 'مالي',
    nameFr: 'Mali',
    slug: 'mali',
    shortCode: 'MLI',
    flag: 'https://flagcdn.com/w320/ml.png',
    logo: 'https://flagcdn.com/w320/ml.png',
    group: 'D' as const,
    city: 'Bamako',
    cityAr: 'باماكو',
    cityFr: 'Bamako',
    founded: 1960,
    colors: { primary: '#14B53A', secondary: '#FCD116' },
    league: 'CAF',
  },
  {
    name: 'Uganda',
    nameAr: 'أوغندا',
    nameFr: 'Ouganda',
    slug: 'uganda',
    shortCode: 'UGA',
    flag: 'https://flagcdn.com/w320/ug.png',
    logo: 'https://flagcdn.com/w320/ug.png',
    group: 'D' as const,
    city: 'Kampala',
    cityAr: 'كمبالا',
    cityFr: 'Kampala',
    founded: 1924,
    colors: { primary: '#FCDC04', secondary: '#D90000' },
    league: 'CAF',
  },
  {
    name: 'Zambia',
    nameAr: 'زامبيا',
    nameFr: 'Zambie',
    slug: 'zambia',
    shortCode: 'ZAM',
    flag: 'https://flagcdn.com/w320/zm.png',
    logo: 'https://flagcdn.com/w320/zm.png',
    group: 'D' as const,
    city: 'Lusaka',
    cityAr: 'لوساكا',
    cityFr: 'Lusaka',
    founded: 1929,
    colors: { primary: '#198A00', secondary: '#EF7D00' },
    league: 'CAF',
  },
  // Group E
  {
    name: 'DR Congo',
    nameAr: 'جمهورية الكونغو الديمقراطية',
    nameFr: 'RD Congo',
    slug: 'dr-congo',
    shortCode: 'COD',
    flag: 'https://flagcdn.com/w320/cd.png',
    logo: 'https://flagcdn.com/w320/cd.png',
    group: 'E' as const,
    city: 'Kinshasa',
    cityAr: 'كينشاسا',
    cityFr: 'Kinshasa',
    founded: 1919,
    colors: { primary: '#007FFF', secondary: '#F7D618' },
    league: 'CAF',
  },
  {
    name: 'Guinea',
    nameAr: 'غينيا',
    nameFr: 'Guinée',
    slug: 'guinea',
    shortCode: 'GUI',
    flag: 'https://flagcdn.com/w320/gn.png',
    logo: 'https://flagcdn.com/w320/gn.png',
    group: 'E' as const,
    city: 'Conakry',
    cityAr: 'كوناكري',
    cityFr: 'Conakry',
    founded: 1960,
    colors: { primary: '#CE1126', secondary: '#FCD116' },
    league: 'CAF',
  },
  {
    name: 'Mozambique',
    nameAr: 'موزمبيق',
    nameFr: 'Mozambique',
    slug: 'mozambique',
    shortCode: 'MOZ',
    flag: 'https://flagcdn.com/w320/mz.png',
    logo: 'https://flagcdn.com/w320/mz.png',
    group: 'E' as const,
    city: 'Maputo',
    cityAr: 'مابوتو',
    cityFr: 'Maputo',
    founded: 1976,
    colors: { primary: '#007A3D', secondary: '#FCE100' },
    league: 'CAF',
  },
  {
    name: 'Benin',
    nameAr: 'بنين',
    nameFr: 'Bénin',
    slug: 'benin',
    shortCode: 'BEN',
    flag: 'https://flagcdn.com/w320/bj.png',
    logo: 'https://flagcdn.com/w320/bj.png',
    group: 'E' as const,
    city: 'Porto-Novo',
    cityAr: 'بورتو نوفو',
    cityFr: 'Porto-Novo',
    founded: 1962,
    colors: { primary: '#008751', secondary: '#FCD116' },
    league: 'CAF',
  },
  // Group F
  {
    name: 'Angola',
    nameAr: 'أنغولا',
    nameFr: 'Angola',
    slug: 'angola',
    shortCode: 'ANG',
    flag: 'https://flagcdn.com/w320/ao.png',
    logo: 'https://flagcdn.com/w320/ao.png',
    group: 'F' as const,
    city: 'Luanda',
    cityAr: 'لواندا',
    cityFr: 'Luanda',
    founded: 1979,
    colors: { primary: '#CE1126', secondary: '#000000' },
    league: 'CAF',
  },
  {
    name: 'Mauritania',
    nameAr: 'موريتانيا',
    nameFr: 'Mauritanie',
    slug: 'mauritania',
    shortCode: 'MTN',
    flag: 'https://flagcdn.com/w320/mr.png',
    logo: 'https://flagcdn.com/w320/mr.png',
    group: 'F' as const,
    city: 'Nouakchott',
    cityAr: 'نواكشوط',
    cityFr: 'Nouakchott',
    founded: 1961,
    colors: { primary: '#006233', secondary: '#FFD700' },
    league: 'CAF',
  },
  {
    name: 'Botswana',
    nameAr: 'بوتسوانا',
    nameFr: 'Botswana',
    slug: 'botswana',
    shortCode: 'BOT',
    flag: 'https://flagcdn.com/w320/bw.png',
    logo: 'https://flagcdn.com/w320/bw.png',
    group: 'F' as const,
    city: 'Gaborone',
    cityAr: 'غابورون',
    cityFr: 'Gaborone',
    founded: 1970,
    colors: { primary: '#75AADB', secondary: '#000000' },
    league: 'CAF',
  },
  {
    name: 'Comoros',
    nameAr: 'جزر القمر',
    nameFr: 'Comores',
    slug: 'comoros',
    shortCode: 'COM',
    flag: 'https://flagcdn.com/w320/km.png',
    logo: 'https://flagcdn.com/w320/km.png',
    group: 'F' as const,
    city: 'Moroni',
    cityAr: 'موروني',
    cityFr: 'Moroni',
    founded: 1979,
    colors: { primary: '#3A75C4', secondary: '#FFC726' },
    league: 'CAF',
  },
];

const generateGroupMatches = (
  teams: any[],
  stadiums: any[],
  baseDate: Date
): any[] => {
  const matches: any[] = [];
  let matchNumber = 1;
  let dayOffset = 0;

  const groups = ['A', 'B', 'C', 'D', 'E', 'F'];

  groups.forEach(group => {
    const groupTeams = teams.filter(t => t.group === group);
    if (groupTeams.length !== 4) return;

    // Round 1
    const match1 = {
      matchNumber: matchNumber++,
      homeTeam: groupTeams[0]._id,
      awayTeam: groupTeams[1]._id,
      stadium: stadiums[dayOffset % stadiums.length]._id,
      competition: 'AFCON 2025',
      stage: 'group',
      group,
      dateTime: new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000),
      status: 'scheduled',
    };
    matches.push(match1);

    const match2 = {
      matchNumber: matchNumber++,
      homeTeam: groupTeams[2]._id,
      awayTeam: groupTeams[3]._id,
      stadium: stadiums[(dayOffset + 1) % stadiums.length]._id,
      competition: 'AFCON 2025',
      stage: 'group',
      group,
      dateTime: new Date(
        baseDate.getTime() + (dayOffset + 1) * 24 * 60 * 60 * 1000
      ),
      status: 'scheduled',
    };
    matches.push(match2);

    // Round 2
    const match3 = {
      matchNumber: matchNumber++,
      homeTeam: groupTeams[0]._id,
      awayTeam: groupTeams[2]._id,
      stadium: stadiums[(dayOffset + 4) % stadiums.length]._id,
      competition: 'AFCON 2025',
      stage: 'group',
      group,
      dateTime: new Date(
        baseDate.getTime() + (dayOffset + 4) * 24 * 60 * 60 * 1000
      ),
      status: 'scheduled',
    };
    matches.push(match3);

    const match4 = {
      matchNumber: matchNumber++,
      homeTeam: groupTeams[1]._id,
      awayTeam: groupTeams[3]._id,
      stadium: stadiums[(dayOffset + 5) % stadiums.length]._id,
      competition: 'AFCON 2025',
      stage: 'group',
      group,
      dateTime: new Date(
        baseDate.getTime() + (dayOffset + 5) * 24 * 60 * 60 * 1000
      ),
      status: 'scheduled',
    };
    matches.push(match4);

    // Round 3
    const match5 = {
      matchNumber: matchNumber++,
      homeTeam: groupTeams[3]._id,
      awayTeam: groupTeams[0]._id,
      stadium: stadiums[(dayOffset + 8) % stadiums.length]._id,
      competition: 'AFCON 2025',
      stage: 'group',
      group,
      dateTime: new Date(
        baseDate.getTime() + (dayOffset + 8) * 24 * 60 * 60 * 1000
      ),
      status: 'scheduled',
    };
    matches.push(match5);

    const match6 = {
      matchNumber: matchNumber++,
      homeTeam: groupTeams[1]._id,
      awayTeam: groupTeams[2]._id,
      stadium: stadiums[(dayOffset + 9) % stadiums.length]._id,
      competition: 'AFCON 2025',
      stage: 'group',
      group,
      dateTime: new Date(
        baseDate.getTime() + (dayOffset + 9) * 24 * 60 * 60 * 1000
      ),
      status: 'scheduled',
    };
    matches.push(match6);

    dayOffset += 2;
  });

  return matches;
};

const seedAfcon = async () => {
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

    console.log('Generating group stage matches...');
    const baseDate = new Date('2025-12-21T18:00:00Z');
    const matchesData = generateGroupMatches(teams, stadiums, baseDate);

    console.log('Seeding matches...');
    const matches = await Match.insertMany(matchesData);
    console.log(`✅ Seeded ${matches.length} matches`);

    console.log('🎉 AFCON 2025 seed completed successfully!');
    console.log(`   - ${stadiums.length} stadiums across 6 cities`);
    console.log(`   - ${teams.length} national teams (6 groups)`);
    console.log(`   - ${matches.length} group stage matches`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAfcon();
