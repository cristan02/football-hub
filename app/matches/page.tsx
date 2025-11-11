export default async function MatchesPage({ searchParams }: { searchParams?: { date?: string; club?: string; minScore?: string; maxScore?: string } }) {
    const params = new URLSearchParams();
    if (searchParams?.date) params.append('date', searchParams.date);
    if (searchParams?.club) params.append('club', searchParams.club);
    if (searchParams?.minScore) params.append('minScore', searchParams.minScore);
    if (searchParams?.maxScore) params.append('maxScore', searchParams.maxScore);

    let matches = [];
    let matchStats: any = {};
    let topScoringMatches = [];
    let attendanceAnalytics = [];

    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app'
            : 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/matches?${params.toString()}`, { next: { revalidate: 0 } });
        const data = await res.json();
        matches = data.matches || [];
        matchStats = data.matchStats || {};
        topScoringMatches = data.topScoringMatches || [];
        attendanceAnalytics = data.attendanceAnalytics || [];
    } catch (error) {
        console.error('Error fetching matches:', error);
    }

    return (
        <div className="min-h-screen bg-gray-900 pt-4">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Match Center</h1>
                    <p className="text-gray-400">Football matches with detailed statistics</p>
                </div>

                {/* Match Statistics */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">📊</span>
                        Match Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Matches</h3>
                            <p className="text-2xl font-bold text-white">{matchStats.totalMatches || 0}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Goals</h3>
                            <p className="text-2xl font-bold text-green-400">{matchStats.avgGoalsPerMatch?.toFixed(1) || '0.0'}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Home Wins</h3>
                            <p className="text-2xl font-bold text-blue-400">{matchStats.homeWinPercentage?.toFixed(1) || '0.0'}%</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">High Scoring</h3>
                            <p className="text-2xl font-bold text-yellow-400">{matchStats.highScoringPercentage?.toFixed(1) || '0.0'}%</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Draw Rate</h3>
                            <p className="text-xl font-bold text-purple-400">{matchStats.drawPercentage?.toFixed(1) || '0.0'}%</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Attendance</h3>
                            <p className="text-xl font-bold text-orange-400">{matchStats.avgAttendance?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Max Goals</h3>
                            <p className="text-xl font-bold text-red-400">{matchStats.maxGoalsInMatch || 0}</p>
                        </div>
                    </div>
                </section>

                {/* Top Scoring Matches */}
                {topScoringMatches.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">🔥</span>
                            Highest Scoring Matches
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topScoringMatches.slice(0, 3).map((match: any, index: number) => (
                                <div key={index} className="bg-gray-800 border border-yellow-600 rounded-lg p-6">
                                    <div className="text-center mb-4">
                                        <div className="text-2xl font-bold text-yellow-400 mb-2">{match.totalGoals} Goals</div>
                                        <div className="text-sm text-gray-400">{new Date(match.date).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-semibold">{match.homeClub?.clubName || 'Unknown'}</span>
                                        <span className="bg-green-600 text-white px-3 py-1 rounded">{match.homeScore}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-semibold">{match.awayClub?.clubName || 'Unknown'}</span>
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded">{match.awayScore}</span>
                                    </div>
                                    {match.attendance && (
                                        <div className="mt-3 text-center text-sm text-gray-400">
                                            👥 {match.attendance.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Attendance Analytics */}
                {attendanceAnalytics.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">👥</span>
                            Attendance by Stadium
                        </h2>
                        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Club</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Avg Attendance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Max Attendance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Matches</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {attendanceAnalytics.slice(0, 8).map((club: any, index: number) => (
                                            <tr key={index} className="hover:bg-gray-750">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{club._id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                                                    {club.avgAttendance?.toLocaleString() || '0'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-semibold">
                                                    {club.maxAttendance?.toLocaleString() || '0'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">{club.totalMatches || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                )}

                {/* Filter Info */}
                {(searchParams?.date || searchParams?.club || searchParams?.minScore || searchParams?.maxScore) && (
                    <div className="mb-6 bg-gray-800 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <h3 className="text-sm font-medium text-blue-400">Applied Filters:</h3>
                        <div className="mt-1 text-sm text-blue-300">
                            {searchParams?.date && <span className="mr-4">📅 Date: {searchParams.date}</span>}
                            {searchParams?.club && <span className="mr-4">🏟️ Club: {searchParams.club}</span>}
                            {searchParams?.minScore && <span className="mr-4">⚽ Min Score: {searchParams.minScore}</span>}
                            {searchParams?.maxScore && <span className="mr-4">🥅 Max Score: {searchParams.maxScore}</span>}
                        </div>
                    </div>
                )}

                {/* All Matches */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">⚽</span>
                        Recent Matches
                    </h2>
                    {matches.length > 0 ? (
                        <div className="space-y-6">
                            {matches.map((match: any) => {
                                const homeWin = match.homeScore > match.awayScore;
                                const draw = match.homeScore === match.awayScore;

                                return (
                                    <div key={match.matchID || Math.random()} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                            {/* Match Info */}
                                            <div className="flex-1 mb-4 lg:mb-0">
                                                <div className="flex items-center justify-center mb-4">
                                                    <div className="text-center flex-1">
                                                        <h3 className={`text-lg font-bold ${homeWin ? 'text-green-400' : draw ? 'text-gray-400' : 'text-red-400'}`}>
                                                            {match.homeClub?.clubName || 'Unknown'}
                                                        </h3>
                                                        <span className="text-xs text-gray-500">HOME</span>
                                                    </div>

                                                    <div className="bg-gray-700 rounded-lg px-4 py-2 mx-4 min-w-[120px]">
                                                        <div className="text-2xl font-bold text-center text-white">
                                                            {match.homeScore} - {match.awayScore}
                                                        </div>
                                                        <div className="text-xs text-center text-gray-400">
                                                            {draw ? 'DRAW' : homeWin ? 'HOME WIN' : 'AWAY WIN'}
                                                        </div>
                                                    </div>

                                                    <div className="text-center flex-1">
                                                        <h3 className={`text-lg font-bold ${!homeWin && !draw ? 'text-green-400' : draw ? 'text-gray-400' : 'text-red-400'}`}>
                                                            {match.awayClub?.clubName || 'Unknown'}
                                                        </h3>
                                                        <span className="text-xs text-gray-500">AWAY</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Match Details */}
                                            <div className="lg:text-right space-y-2 lg:min-w-[150px]">
                                                <div className="text-sm text-gray-400">
                                                    📅 {match.date ? new Date(match.date).toLocaleDateString() : 'N/A'}
                                                </div>
                                                {match.attendance && (
                                                    <div className="text-sm text-gray-400">
                                                        👥 {match.attendance.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">⚽</div>
                            <h3 className="text-lg font-medium text-white mb-2">No matches found</h3>
                            <p className="text-gray-400">Match data is currently unavailable or no matches match the filters.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}