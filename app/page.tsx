import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Player Statistics",
      description: "Comprehensive player analytics with performance metrics, position analysis, and detailed insights",
      href: "/player-stats",
      icon: "📊"
    },
    {
      title: "Transfer Market",
      description: "Explore transfer activities, market values, and player movements between clubs",
      href: "/transfers",
      icon: "🔄"
    },
    {
      title: "Match Center",
      description: "Browse matches, scores, and match statistics with advanced filtering options",
      href: "/matches",
      icon: "⚽"
    },
    {
      title: "Search Engine",
      description: "Find players and clubs quickly with powerful search and filtering capabilities",
      href: "/search",
      icon: "🔍"
    }
  ];

  const techStack = [
    { name: "Next.js 15", description: "React framework with App Router" },
    { name: "MongoDB", description: "NoSQL database" },
    { name: "TypeScript", description: "Type-safe development" },
    { name: "Tailwind CSS", description: "Modern styling" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-white mb-4">
              ⚽ Football Hub
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A comprehensive football data management system showcasing modern web development.
            Explore player statistics, transfers, matches, and search through football data with ease.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">6</div>
              <div className="text-sm text-gray-400">Football Clubs</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">18</div>
              <div className="text-sm text-gray-400">Players</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-purple-400">6</div>
              <div className="text-sm text-gray-400">Matches</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-orange-400">5</div>
              <div className="text-sm text-gray-400">Transfers</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-700 hover:border-blue-500 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
