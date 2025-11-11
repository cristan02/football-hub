// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.transfer.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.match.deleteMany();
    await prisma.player.deleteMany();
    await prisma.club.deleteMany();

    // Seed Clubs
    const clubs = await Promise.all([
        prisma.club.create({
            data: {
                clubID: 'CLB001',
                clubName: 'Manchester United',
                founded: 1878,
                stadium: 'Old Trafford',
                capacity: 74879,
                manager: 'Erik ten Hag',
                budget: 500000000,
                league: 'Premier League'
            }
        }),
        prisma.club.create({
            data: {
                clubID: 'CLB002',
                clubName: 'Real Madrid',
                founded: 1902,
                stadium: 'Santiago Bernabeu',
                capacity: 81044,
                manager: 'Carlo Ancelotti',
                budget: 750000000,
                league: 'La Liga'
            }
        }),
        prisma.club.create({
            data: {
                clubID: 'CLB003',
                clubName: 'Barcelona',
                founded: 1899,
                stadium: 'Camp Nou',
                capacity: 99354,
                manager: 'Xavi Hernandez',
                budget: 650000000,
                league: 'La Liga'
            }
        }),
        prisma.club.create({
            data: {
                clubID: 'CLB004',
                clubName: 'Paris Saint-Germain',
                founded: 1970,
                stadium: 'Parc des Princes',
                capacity: 47929,
                manager: 'Luis Enrique',
                budget: 800000000,
                league: 'Ligue 1'
            }
        }),
        prisma.club.create({
            data: {
                clubID: 'CLB005',
                clubName: 'Bayern Munich',
                founded: 1900,
                stadium: 'Allianz Arena',
                capacity: 75024,
                manager: 'Thomas Tuchel',
                budget: 700000000,
                league: 'Bundesliga'
            }
        }),
        prisma.club.create({
            data: {
                clubID: 'CLB006',
                clubName: 'Liverpool',
                founded: 1892,
                stadium: 'Anfield',
                capacity: 53394,
                manager: 'Jurgen Klopp',
                budget: 450000000,
                league: 'Premier League'
            }
        })
    ]);

    console.log('✅ Clubs created');

    // Seed Players
    const players = await Promise.all([
        // Manchester United Players
        prisma.player.create({
            data: {
                playerID: 'PLR001',
                name: 'Marcus Rashford',
                age: 26,
                position: 'Forward',
                nationality: 'England',
                jerseyNumber: 10,
                salary: 250000,
                goals: 17,
                assists: 5,
                matchesPlayed: 32,
                clubID: 'CLB001'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR002',
                name: 'Bruno Fernandes',
                age: 29,
                position: 'Midfielder',
                nationality: 'Portugal',
                jerseyNumber: 8,
                salary: 220000,
                goals: 12,
                assists: 15,
                matchesPlayed: 35,
                clubID: 'CLB001'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR003',
                name: 'Raphael Varane',
                age: 30,
                position: 'Defender',
                nationality: 'France',
                jerseyNumber: 19,
                salary: 200000,
                goals: 2,
                assists: 1,
                matchesPlayed: 28,
                clubID: 'CLB001'
            }
        }),
        // Real Madrid Players
        prisma.player.create({
            data: {
                playerID: 'PLR004',
                name: 'Vinicius Junior',
                age: 23,
                position: 'Forward',
                nationality: 'Brazil',
                jerseyNumber: 7,
                salary: 280000,
                goals: 24,
                assists: 10,
                matchesPlayed: 38,
                clubID: 'CLB002'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR005',
                name: 'Jude Bellingham',
                age: 20,
                position: 'Midfielder',
                nationality: 'England',
                jerseyNumber: 5,
                salary: 300000,
                goals: 19,
                assists: 8,
                matchesPlayed: 36,
                clubID: 'CLB002'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR006',
                name: 'Antonio Rudiger',
                age: 30,
                position: 'Defender',
                nationality: 'Germany',
                jerseyNumber: 22,
                salary: 180000,
                goals: 3,
                assists: 2,
                matchesPlayed: 34,
                clubID: 'CLB002'
            }
        }),
        // Barcelona Players
        prisma.player.create({
            data: {
                playerID: 'PLR007',
                name: 'Robert Lewandowski',
                age: 35,
                position: 'Forward',
                nationality: 'Poland',
                jerseyNumber: 9,
                salary: 320000,
                goals: 26,
                assists: 7,
                matchesPlayed: 35,
                clubID: 'CLB003'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR008',
                name: 'Gavi',
                age: 19,
                position: 'Midfielder',
                nationality: 'Spain',
                jerseyNumber: 6,
                salary: 150000,
                goals: 5,
                assists: 11,
                matchesPlayed: 30,
                clubID: 'CLB003'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR009',
                name: 'Ronald Araujo',
                age: 24,
                position: 'Defender',
                nationality: 'Uruguay',
                jerseyNumber: 4,
                salary: 160000,
                goals: 4,
                assists: 1,
                matchesPlayed: 29,
                clubID: 'CLB003'
            }
        }),
        // PSG Players
        prisma.player.create({
            data: {
                playerID: 'PLR010',
                name: 'Kylian Mbappe',
                age: 25,
                position: 'Forward',
                nationality: 'France',
                jerseyNumber: 7,
                salary: 500000,
                goals: 32,
                assists: 12,
                matchesPlayed: 36,
                clubID: 'CLB004'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR011',
                name: 'Achraf Hakimi',
                age: 25,
                position: 'Defender',
                nationality: 'Morocco',
                jerseyNumber: 2,
                salary: 190000,
                goals: 5,
                assists: 9,
                matchesPlayed: 33,
                clubID: 'CLB004'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR012',
                name: 'Marco Verratti',
                age: 31,
                position: 'Midfielder',
                nationality: 'Italy',
                jerseyNumber: 6,
                salary: 210000,
                goals: 2,
                assists: 8,
                matchesPlayed: 28,
                clubID: 'CLB004'
            }
        }),
        // Bayern Munich Players
        prisma.player.create({
            data: {
                playerID: 'PLR013',
                name: 'Harry Kane',
                age: 30,
                position: 'Forward',
                nationality: 'England',
                jerseyNumber: 9,
                salary: 400000,
                goals: 36,
                assists: 11,
                matchesPlayed: 38,
                clubID: 'CLB005'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR014',
                name: 'Joshua Kimmich',
                age: 28,
                position: 'Midfielder',
                nationality: 'Germany',
                jerseyNumber: 6,
                salary: 270000,
                goals: 4,
                assists: 13,
                matchesPlayed: 36,
                clubID: 'CLB005'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR015',
                name: 'Matthijs de Ligt',
                age: 24,
                position: 'Defender',
                nationality: 'Netherlands',
                jerseyNumber: 4,
                salary: 220000,
                goals: 3,
                assists: 1,
                matchesPlayed: 32,
                clubID: 'CLB005'
            }
        }),
        // Liverpool Players
        prisma.player.create({
            data: {
                playerID: 'PLR016',
                name: 'Mohamed Salah',
                age: 31,
                position: 'Forward',
                nationality: 'Egypt',
                jerseyNumber: 11,
                salary: 350000,
                goals: 25,
                assists: 14,
                matchesPlayed: 37,
                clubID: 'CLB006'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR017',
                name: 'Virgil van Dijk',
                age: 32,
                position: 'Defender',
                nationality: 'Netherlands',
                jerseyNumber: 4,
                salary: 240000,
                goals: 4,
                assists: 2,
                matchesPlayed: 35,
                clubID: 'CLB006'
            }
        }),
        prisma.player.create({
            data: {
                playerID: 'PLR018',
                name: 'Trent Alexander-Arnold',
                age: 25,
                position: 'Defender',
                nationality: 'England',
                jerseyNumber: 66,
                salary: 200000,
                goals: 3,
                assists: 12,
                matchesPlayed: 34,
                clubID: 'CLB006'
            }
        })
    ]);

    console.log('✅ Players created');

    // Seed Matches
    const matches = await Promise.all([
        prisma.match.create({
            data: {
                matchID: 'MAT001',
                homeClubID: 'CLB001',
                awayClubID: 'CLB006',
                date: new Date('2024-09-15'),
                homeScore: 3,
                awayScore: 2,
                stadium: 'Old Trafford',
                attendance: 73500,
                referee: 'Michael Oliver'
            }
        }),
        prisma.match.create({
            data: {
                matchID: 'MAT002',
                homeClubID: 'CLB002',
                awayClubID: 'CLB003',
                date: new Date('2024-10-20'),
                homeScore: 2,
                awayScore: 1,
                stadium: 'Santiago Bernabeu',
                attendance: 80000,
                referee: 'Antonio Mateu'
            }
        }),
        prisma.match.create({
            data: {
                matchID: 'MAT003',
                homeClubID: 'CLB004',
                awayClubID: 'CLB005',
                date: new Date('2024-11-05'),
                homeScore: 1,
                awayScore: 3,
                stadium: 'Parc des Princes',
                attendance: 47000,
                referee: 'Clement Turpin'
            }
        }),
        prisma.match.create({
            data: {
                matchID: 'MAT004',
                homeClubID: 'CLB003',
                awayClubID: 'CLB004',
                date: new Date('2024-09-28'),
                homeScore: 2,
                awayScore: 2,
                stadium: 'Camp Nou',
                attendance: 95000,
                referee: 'Jose Sanchez'
            }
        }),
        prisma.match.create({
            data: {
                matchID: 'MAT005',
                homeClubID: 'CLB006',
                awayClubID: 'CLB002',
                date: new Date('2024-10-10'),
                homeScore: 1,
                awayScore: 0,
                stadium: 'Anfield',
                attendance: 53000,
                referee: 'Anthony Taylor'
            }
        }),
        prisma.match.create({
            data: {
                matchID: 'MAT006',
                homeClubID: 'CLB005',
                awayClubID: 'CLB001',
                date: new Date('2024-11-15'),
                homeScore: 4,
                awayScore: 1,
                stadium: 'Allianz Arena',
                attendance: 74000,
                referee: 'Felix Brych'
            }
        })
    ]);

    console.log('✅ Matches created');

    // Seed Transfers
    const transfers = await Promise.all([
        prisma.transfer.create({
            data: {
                transferID: 'TRF001',
                playerID: 'PLR005',
                fromClubID: 'CLB003',
                toClubID: 'CLB002',
                transferFee: 103000000,
                date: new Date('2023-06-15'),
                contractYears: 6
            }
        }),
        prisma.transfer.create({
            data: {
                transferID: 'TRF002',
                playerID: 'PLR013',
                fromClubID: 'CLB001',
                toClubID: 'CLB005',
                transferFee: 100000000,
                date: new Date('2023-08-12'),
                contractYears: 4
            }
        }),
        prisma.transfer.create({
            data: {
                transferID: 'TRF003',
                playerID: 'PLR007',
                fromClubID: 'CLB005',
                toClubID: 'CLB003',
                transferFee: 45000000,
                date: new Date('2022-07-20'),
                contractYears: 3
            }
        }),
        prisma.transfer.create({
            data: {
                transferID: 'TRF004',
                playerID: 'PLR011',
                fromClubID: 'CLB002',
                toClubID: 'CLB004',
                transferFee: 60000000,
                date: new Date('2021-07-06'),
                contractYears: 5
            }
        }),
        prisma.transfer.create({
            data: {
                transferID: 'TRF005',
                playerID: 'PLR006',
                fromClubID: 'CLB006',
                toClubID: 'CLB002',
                transferFee: 0,
                date: new Date('2022-06-30'),
                contractYears: 4
            }
        })
    ]);

    console.log('✅ Transfers created');

    // Seed Staff
    const staff = await Promise.all([
        prisma.staff.create({
            data: {
                staffID: 'STF001',
                name: 'Mitchell van der Gaag',
                role: 'Assistant Coach',
                clubID: 'CLB001',
                salary: 80000,
                yearsOfExperience: 15
            }
        }),
        prisma.staff.create({
            data: {
                staffID: 'STF002',
                name: 'David de Gea',
                role: 'Goalkeeping Coach',
                clubID: 'CLB001',
                salary: 60000,
                yearsOfExperience: 8
            }
        }),
        prisma.staff.create({
            data: {
                staffID: 'STF003',
                name: 'Davide Ancelotti',
                role: 'Assistant Coach',
                clubID: 'CLB002',
                salary: 90000,
                yearsOfExperience: 12
            }
        }),
        prisma.staff.create({
            data: {
                staffID: 'STF004',
                name: 'Sergio Busquets',
                role: 'Midfield Coach',
                clubID: 'CLB003',
                salary: 70000,
                yearsOfExperience: 10
            }
        }),
        prisma.staff.create({
            data: {
                staffID: 'STF005',
                name: 'Luis Campos',
                role: 'Sporting Director',
                clubID: 'CLB004',
                salary: 150000,
                yearsOfExperience: 20
            }
        }),
        prisma.staff.create({
            data: {
                staffID: 'STF006',
                name: 'Pep Lijnders',
                role: 'Assistant Manager',
                clubID: 'CLB006',
                salary: 100000,
                yearsOfExperience: 18
            }
        })
    ]);

    console.log('✅ Staff created');
    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });