
export default async function PlayerStatsPage() {
    const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app'
        : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/player-stats`, {
        next: { revalidate: 0 },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch player stats');
    }

    const { positions, nationalities, topPerformers, leagueAnalytics } = await res.json();

    return (
        <div className="min-h-screen bg-gray-900 pt-4">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Player Statistics</h1>
                    <p className="text-gray-400">Performance analytics and player data insights</p>
                </div>

                {/* Top Performers Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">🏆</span>
                        Top Performers
                    </h2>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Player</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Club</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Goals</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assists</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {topPerformers.map((player: any, index: number) => (
                                        <tr key={player._id} className={`${index === 0 ? 'bg-yellow-900/20' : 'hover:bg-gray-750'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-yellow-400 font-bold text-lg">#{index + 1}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white font-semibold">{player.name}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                                                    {player.position}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.clubName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">{player.goals}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400 font-semibold">{player.assists}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-bold">{player.performanceScore.toFixed(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* League Analytics */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">�</span>
                        League Analytics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leagueAnalytics.map((league: any, index: number) => (
                            <div key={league._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all">
                                <h3 className="text-lg font-bold text-white mb-4">{league._id}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Players:</span>
                                        <span className="text-blue-400 font-semibold">{league.playerCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Total Goals:</span>
                                        <span className="text-green-400 font-semibold">{league.totalGoals}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Goals/Player:</span>
                                        <span className="text-yellow-400 font-semibold">{league.avgGoalsPerPlayer.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Avg Age:</span>
                                        <span className="text-gray-300 font-medium">{league.avgAge.toFixed(1)}y</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Avg Salary:</span>
                                        <span className="text-orange-400 font-semibold">€{league.avgSalary.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Position Stats */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">📊</span>
                        Position Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {positions.map((pos: any) => (
                            <div key={pos.position} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
                                <h3 className="text-lg font-bold text-white mb-4">{pos.position}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Players:</span>
                                        <span className="text-blue-400 font-semibold">{pos.count}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Avg Age:</span>
                                        <span className="text-gray-300 font-medium">{pos.avgAge?.toFixed(1)}y</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Avg Goals:</span>
                                        <span className="text-green-400 font-semibold">{pos.avgGoals?.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Avg Assists:</span>
                                        <span className="text-purple-400 font-semibold">{pos.avgAssists?.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Nationality Stats */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">🌍</span>
                        Nationality Distribution
                    </h2>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {nationalities.map((nat: any) => (
                                <div key={nat.nationality} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600">
                                    <span className="font-medium text-white">{nat.nationality}</span>
                                    <span className="bg-green-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
                                        {nat.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
