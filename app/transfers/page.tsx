export default async function TransfersPage() {
    let transfers = [];
    let transferAnalytics = [];
    let expensiveTransfers = [];

    try {
        const res = await fetch('http://localhost:3000/api/transfers', { next: { revalidate: 0 } });
        const data = await res.json();
        transfers = data.transfers || [];
        transferAnalytics = data.transferAnalytics || [];
        expensiveTransfers = data.expensiveTransfers || [];
    } catch (error) {
        console.error('Error fetching transfers:', error);
    }

    return (
        <div className="min-h-screen bg-gray-900 pt-4">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Transfer Market</h1>
                    <p className="text-gray-400">Transfer activity and market analytics</p>
                </div>

                {/* Most Expensive Transfers */}
                {expensiveTransfers.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">💎</span>
                            Record Transfers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {expensiveTransfers.slice(0, 3).map((transfer: any, index: number) => (
                                <div key={index} className="bg-gray-800 border border-yellow-600 rounded-lg p-6">
                                    <div className="text-center mb-4">
                                        <div className="text-2xl font-bold text-yellow-400">#{index + 1}</div>
                                        <div className="text-xl font-bold text-white">€{transfer.transferFee?.toLocaleString() || 'N/A'}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-white font-semibold text-center">{transfer.playerName || 'Unknown Player'}</div>
                                        <div className="text-yellow-400 text-center text-sm">{transfer.position || 'Unknown'}</div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">From:</span>
                                            <span className="text-red-400 font-medium">{transfer.fromClub || 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">To:</span>
                                            <span className="text-green-400 font-medium">{transfer.toClub || 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Date:</span>
                                            <span className="text-gray-300">{transfer.date ? new Date(transfer.date).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Transfer Analytics by Position */}
                {transferAnalytics.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">📊</span>
                            Market Analysis by Position
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {transferAnalytics.map((analysis: any, index: number) => (
                                <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-all">
                                    <h3 className="text-lg font-bold text-white mb-4">{analysis._id || 'Unknown Position'}</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Avg Fee:</span>
                                            <span className="text-green-400 font-bold">€{analysis.avgTransferFee?.toLocaleString() || '0'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Transfers:</span>
                                            <span className="text-blue-400 font-semibold">{analysis.totalTransfers || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Max Fee:</span>
                                            <span className="text-yellow-400 font-semibold">€{analysis.maxTransferFee?.toLocaleString() || '0'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Total Value:</span>
                                            <span className="text-purple-400 font-semibold">€{analysis.totalValue?.toLocaleString() || '0'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Avg Contract:</span>
                                            <span className="text-orange-400 font-semibold">{analysis.avgContractYears?.toFixed(1) || '0.0'}y</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Transfers */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">🔄</span>
                        Transfer Activity
                    </h2>
                    {transfers.length > 0 ? (
                        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Player</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">From</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">To</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contract</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {transfers.map((transfer: any, index: number) => (
                                            <tr key={transfer.transferID || index} className="hover:bg-gray-750">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-white">{transfer.player?.name || 'Unknown Player'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                                                        {transfer.player?.position || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{transfer.fromClub?.clubName || 'Unknown'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{transfer.toClub?.clubName || 'Unknown'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-semibold">
                                                    €{transfer.transferFee ? transfer.transferFee.toLocaleString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-400">
                                                    {transfer.contractYears || 'N/A'} years
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {transfer.date ? new Date(transfer.date).toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔄</div>
                            <h3 className="text-lg font-medium text-white mb-2">No transfers found</h3>
                            <p className="text-gray-400">Transfer data is currently unavailable.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}