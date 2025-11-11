export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; type?: string }> }) {
    const resolvedSearchParams = await searchParams;
    const params = new URLSearchParams();
    if (resolvedSearchParams?.q) params.append('q', resolvedSearchParams.q);
    if (resolvedSearchParams?.type) params.append('type', resolvedSearchParams.type);

    let results = [];
    let searchAnalytics = [];
    let nationalityStats = [];
    let leagueStats = [];
    let topPlayers = [];
    let searchQuery = '';
    let resultCount = 0;

    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            : 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/search?${params.toString()}`, { next: { revalidate: 0 } });
        const data = await res.json();
        results = data.results || [];
        searchAnalytics = data.searchAnalytics || [];
        nationalityStats = data.nationalityStats || [];
        leagueStats = data.leagueStats || [];
        topPlayers = data.topPlayers || [];
        searchQuery = data.searchQuery || '';
        resultCount = data.resultCount || 0;
    } catch (error) {
        console.error('Error fetching search data:', error);
    }

    const q = resolvedSearchParams?.q || '';
    const type = resolvedSearchParams?.type || 'player';

    return (
        <div className="min-h-screen bg-gray-900 pt-4">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Search Players & Clubs</h1>
                    <p className="text-gray-400">Find players and clubs by name</p>
                </div>

                {/* Database Overview */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">📊</span>
                        Database Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Players</h3>
                            <p className="text-2xl font-bold text-white">{resultCount > 0 ? resultCount : 'Loading...'}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Unique Positions</h3>
                            <p className="text-2xl font-bold text-green-400">{searchAnalytics.length || 0}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Countries</h3>
                            <p className="text-2xl font-bold text-blue-400">{nationalityStats.length || 0}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Leagues</h3>
                            <p className="text-2xl font-bold text-yellow-400">{leagueStats.length || 0}</p>
                        </div>
                    </div>
                </section>

                {/* Position Analytics */}
                {searchAnalytics.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">⚽</span>
                            Position Distribution
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchAnalytics.slice(0, 6).map((position: any, index: number) => (
                                <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-all">
                                    <h3 className="text-lg font-bold text-white mb-4">{position._id || 'Unknown'}</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Players:</span>
                                            <span className="text-green-400 font-bold">{position.playerCount || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Avg Age:</span>
                                            <span className="text-blue-400 font-semibold">{position.avgAge ? Math.round(position.avgAge * 10) / 10 : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Avg Market Value:</span>
                                            <span className="text-yellow-400 font-semibold">
                                                {position.avgMarketValue ?
                                                    `€${Math.round(position.avgMarketValue).toLocaleString()}` :
                                                    'No data'
                                                }
                                            </span>
                                        </div>
                                        {position.playersWithTransfers > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-xs">Transfer Data:</span>
                                                <span className="text-gray-500 text-xs">{position.playersWithTransfers} of {position.playerCount} players</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">🔍</span>
                        Search by Name
                    </h2>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <form method="get" className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name Search</label>
                                <input
                                    name="q"
                                    placeholder="Enter player or club name..."
                                    defaultValue={q}
                                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                <select
                                    name="type"
                                    defaultValue={type}
                                    className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="player">🏃‍♂️ Players</option>
                                    <option value="club">🏟️ Clubs</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
                                >
                                    🔍 Search
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* All Players/Clubs Display */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                            {type === 'player' ? '🏃‍♂️' : '🏟️'}
                        </span>
                        {searchQuery ? `Search Results for "${searchQuery}"` : `All ${type === 'player' ? 'Players' : 'Clubs'}`}
                    </h2>

                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {type === 'player' ? (
                                results.map((player: any, index: number) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
                                        <div className="text-center mb-4">
                                            <div className="bg-blue-900 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                                <span className="text-blue-400 font-bold text-xl">⚽</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1">{player.name || 'Unknown'}</h3>
                                            <p className="text-gray-400 text-sm">{player.position || 'Unknown'}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Club:</span>
                                                <span className="text-green-400 font-medium text-sm">{player.club?.clubName || 'Free Agent'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Nationality:</span>
                                                <span className="text-blue-400 font-medium text-sm">{player.nationality || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Age:</span>
                                                <span className="text-gray-300 font-medium">{player.age || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Transfer Value:</span>
                                                <span className="text-yellow-400 font-bold">€{player.latestTransferFee && player.latestTransferFee > 0 ? player.latestTransferFee.toLocaleString() : 'Unknown'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                results.map((club: any, index: number) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-all">
                                        <div className="text-center mb-4">
                                            <div className="bg-green-900 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                                <span className="text-green-400 font-bold text-xl">🏟️</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1">{club.clubName || 'Unknown'}</h3>
                                            <p className="text-gray-400 text-sm">{club.league || 'Unknown League'}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Manager:</span>
                                                <span className="text-blue-400 font-medium text-sm">{club.manager || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Founded:</span>
                                                <span className="text-yellow-400 font-medium">{club.founded || 'Unknown'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                            <p className="text-gray-400">Try adjusting your search criteria or search type.</p>
                        </div>
                    )}
                </section>


            </div>
        </div>
    );
}