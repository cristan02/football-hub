'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/player-stats', label: 'Player Stats' },
        { href: '/transfers', label: 'Transfers' },
        { href: '/matches', label: 'Matches' },
        { href: '/search', label: 'Search' },
    ];

    return (
        <nav className="bg-gray-800 text-white shadow-xl border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold flex items-center hover:text-blue-400 transition-colors">
                            <span className="mr-2">⚽</span>
                            Football Hub
                        </Link>
                    </div>
                    <div className="flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${pathname === item.href
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;