import mongoose from 'mongoose';
import { config } from '../config';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';
import { Match } from '../models/Match';

const stadiumsData = [
  {
    name: 'Mohammed V Stadium',
    nameAr: 'ملعب محمد الخامس',
    nameFr: 'Stade Mohammed V',
    slug: 'mohammed-v-stadium',
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
    facilities: ['Parking', 'Food Court', 'VIP Boxes'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
  {
    name: 'Prince Moulay Abdellah Stadium',
    nameAr: 'ملعب الأمير مولاي عبد الله',
    nameFr: 'Stade Prince Moulay Abdellah',
    slug: 'prince-moulay-abdellah-stadium',
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
    facilities: ['Parking', 'Athletics Track', 'VIP Boxes'],
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
    },
  },
];

const teamsData = [
  {
    name: 'Raja Casablanca',
    nameAr: 'الرجاء الرياضي',
    nameFr: 'Raja Club Athletic',
    slug: 'raja-casablanca',
    logo: '/logos/raja.png',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    cityFr: 'Casablanca',
    founded: 1949,
    colors: {
      primary: '#006233',
      secondary: '#FFFFFF',
    },
    league: 'Botola Pro',
  },
  {
    name: 'Wydad Casablanca',
    nameAr: 'الوداد الرياضي',
    nameFr: 'Wydad Athletic Club',
    slug: 'wydad-casablanca',
    logo: '/logos/wydad.png',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    cityFr: 'Casablanca',
    founded: 1937,
    colors: {
      primary: '#C1272D',
      secondary: '#FFFFFF',
    },
    league: 'Botola Pro',
  },
  {
    name: 'FUS Rabat',
    nameAr: 'الفتح الرياضي',
    nameFr: 'Fath Union Sport',
    slug: 'fus-rabat',
    logo: '/logos/fus.png',
    city: 'Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    founded: 1946,
    colors: {
      primary: '#FFD700',
      secondary: '#000000',
    },
    league: 'Botola Pro',
  },
];

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

    const mohammedVStadium = stadiums.find(
      s => s.slug === 'mohammed-v-stadium'
    );
    const princeAbdellahStadium = stadiums.find(
      s => s.slug === 'prince-moulay-abdellah-stadium'
    );

    console.log('Seeding teams...');
    const teamsWithStadiums = teamsData.map(team => {
      if (team.city === 'Casablanca') {
        return { ...team, stadium: mohammedVStadium?._id };
      } else if (team.city === 'Rabat') {
        return { ...team, stadium: princeAbdellahStadium?._id };
      }
      return team;
    });

    const teams = await Team.insertMany(teamsWithStadiums);
    console.log(`✅ Seeded ${teams.length} teams`);

    const rajaTeam = teams.find(t => t.slug === 'raja-casablanca');
    const wydadTeam = teams.find(t => t.slug === 'wydad-casablanca');
    const fusTeam = teams.find(t => t.slug === 'fus-rabat');

    if (mohammedVStadium && rajaTeam && wydadTeam) {
      await Stadium.findByIdAndUpdate(mohammedVStadium._id, {
        homeTeams: [rajaTeam._id, wydadTeam._id],
      });
    }

    if (princeAbdellahStadium && fusTeam) {
      await Stadium.findByIdAndUpdate(princeAbdellahStadium._id, {
        homeTeams: [fusTeam._id],
      });
    }

    console.log('Seeding matches...');
    const matchesData = [
      {
        homeTeam: rajaTeam?._id,
        awayTeam: wydadTeam?._id,
        stadium: mohammedVStadium?._id,
        competition: 'Botola Pro',
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'scheduled' as const,
        ticketInfo: {
          available: true,
          url: 'https://tickets.example.com',
          priceRange: {
            min: 50,
            max: 200,
            currency: 'MAD',
          },
        },
      },
      {
        homeTeam: fusTeam?._id,
        awayTeam: rajaTeam?._id,
        stadium: princeAbdellahStadium?._id,
        competition: 'Botola Pro',
        dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'scheduled' as const,
        ticketInfo: {
          available: true,
          priceRange: {
            min: 40,
            max: 150,
            currency: 'MAD',
          },
        },
      },
    ];

    const matches = await Match.insertMany(matchesData);
    console.log(`✅ Seeded ${matches.length} matches`);

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
