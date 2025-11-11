# ⚽ Football Hub

A comprehensive football data management system built with **Next.js 15** and **MongoDB**, showcasing modern web development practices with advanced database operations and responsive UI design.

![Next.js](https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=nextdotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🎯 Project Overview

Football Hub is a full-stack web application that manages football-related data including players, clubs, matches, transfers, and staff. The project demonstrates advanced MongoDB aggregation operations, modern React patterns, and responsive design principles.

### 🌟 Key Features

- **Player Analytics** - Comprehensive player statistics with performance metrics
- **Transfer Market** - Transfer history and market value analysis based on actual transfer fees
- **Match Center** - Match results, fixtures, and attendance analytics
- **Search Engine** - Smart search functionality with real-time filtering
- **Data Visualization** - Interactive charts and statistics
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Responsive Design
- **Backend**: Next.js API Routes, Server Components
- **Database**: MongoDB with native driver
- **ORM**: Prisma Client
- **Runtime**: Node.js

---

## 📊 Database Schema

The application uses 5 main collections:

- **Players**: Player information, stats, and performance data
- **Clubs**: Football clubs with stadium and management details
- **Matches**: Match results, scores, and attendance data
- **Transfers**: Transfer history with fees and contract details
- **Staff**: Club staff and coaching personnel

## 🎮 Page-by-Page Operations

### 🏠 **Homepage (`/`)**

**Purpose**: Application overview and navigation hub with clean user interface

**Technical Operations**:

- **Data Aggregation**: Server-side MongoDB queries for dashboard statistics
- **Collection Counting**: Real-time count queries across multiple collections (clubs, players, matches, transfers)
- **Static Page Rendering**: Next.js Server Components for optimal performance
- **Navigation Routing**: App Router navigation to all application features

**MongoDB Query Types Used**:

- **Count Queries**: Document counting across multiple collections
- **Parallel Aggregation**: Concurrent database operations for performance
- **Collection Statistics**: Real-time data metrics retrieval
- **Server-Side Rendering**: Pre-computed statistics for faster page loads

**Key Features**:

- Clean card-based layout with technology stack display
- Real-time statistics without MongoDB operation tags
- User-focused navigation without technical complexity
- Responsive design with consistent color scheme

---

### 📊 **Player Statistics (`/player-stats`)**

**Purpose**: Advanced player analytics and comprehensive performance insights

**Technical Operations**:

- **Multi-Stage Aggregation**: Complex MongoDB pipelines combining player, club, and performance data
- **Statistical Computing**: Server-side calculations for averages, rankings, and distributions
- **Cross-Collection Joins**: `$lookup` operations linking players with clubs and leagues
- **Position Analytics**: Grouping and averaging operations by player positions
- **Performance Ranking**: Sorted queries with limit operations for top performers

**MongoDB Query Types Used**:

- **$lookup Operations**: Multi-collection joins (players → clubs → leagues)
- **$addFields Calculations**: Performance score computations and derived metrics
- **$group Aggregations**: Position-based statistical grouping and averaging
- **$sort Operations**: Performance-based ranking and ordering
- **Statistical Functions**: $avg, $sum, $multiply operations for analytics
- **Conditional Logic**: Complex field transformations and score calculations

**Data Processing Features**:

- Real-time nationality distribution analysis
- League-wise player performance comparisons
- Position-based statistical insights
- Top performer identification and ranking

---

### 🔄 **Transfer Market (`/transfers`)**

**Purpose**: Comprehensive transfer market analysis with real-world financial data

**Technical Operations**:

- **Multi-Collection Aggregation**: Complex joins between transfers, players, and clubs
- **Financial Analytics**: Transfer fee calculations and market trend analysis
- **Temporal Queries**: Time-based filtering and chronological sorting
- **Market Valuation**: Real transfer fee data for accurate market insights
- **Record Analysis**: Identification of highest-value transfers and patterns

**MongoDB Query Types Used**:

- **Triple $lookup Joins**: Complex multi-collection relationships (transfers → players → clubs)
- **$addFields Transformations**: Date-based transfer window calculations
- **$switch Conditional Logic**: Seasonal transfer window categorization
- **Financial Aggregations**: Transfer fee analysis and market trend calculations
- **$sort Operations**: Descending transfer fee ordering for record identification
- **Temporal Queries**: Date-based filtering and chronological analysis

**Market Analysis Features**:

- Transfer fee trend analysis over time
- Position-based transfer value patterns
- Club transfer activity and spending analysis
- Transfer window seasonality insights

---

### ⚽ **Match Center (`/matches`)**

**Purpose**: Comprehensive match data management with advanced filtering capabilities

**Technical Operations**:

- **Dynamic Query Building**: Conditional MongoDB queries based on user filters
- **Multi-Parameter Filtering**: Date ranges, club selection, and score filters
- **Attendance Analytics**: Statistical analysis of stadium data
- **Result Aggregation**: Match outcome patterns and goal distribution
- **Club Performance Tracking**: Win/loss ratios and performance metrics

**MongoDB Query Types Used**:

- **Dynamic $match Conditions**: Conditional filtering based on multiple parameters
- **Date Range Queries**: Temporal filtering with $gte operators
- **$or Logic**: Multi-field club matching (home/away clubs)
- **$expr Operations**: Complex score calculations with $add functions
- **Dual $lookup Operations**: Home and away club data enrichment
- **Pipeline Construction**: Dynamic aggregation pipeline building

**Advanced Features**:

- Real-time match result updates
- Stadium attendance trend analysis
- Goal distribution and scoring pattern insights
- Head-to-head club performance comparisons

---

### 🔍 **Search & Analytics (`/search`)**

**Purpose**: Intelligent search system with comprehensive database analytics

**Technical Operations**:

- **Multi-Type Search**: Unified search across players and clubs with type switching
- **Transfer Fee Integration**: Market value calculations based on actual transfer data
- **Real-Time Database Metrics**: Live collection statistics and data insights
- **Position-Based Analytics**: Transfer fee averaging with conditional logic
- **Smart Filtering**: Regex-based name searches with case-insensitive matching

**MongoDB Query Types Used**:

- **Text Search**: Regex-based name matching with case-insensitive options
- **Transfer Integration**: $lookup operations for market value calculations
- **Conditional Logic**: $cond operations for transfer fee handling
- **Array Operations**: $size, $max functions for transfer history analysis
- **Club Enrichment**: Secondary $lookup for current club information
- **$project Transformations**: Field selection and computed value creation
- **Position Analytics**: $group operations with conditional averaging
- **Market Filtering**: $match conditions excluding players without transfers

**Real-Time Analytics Features**:

- Live database collection counts and statistics
- Transfer fee-based market value calculations (no salary dependency)
- Position distribution with accurate averaging (excludes players without transfers)
- Top players showcase based on actual transfer history
- Dynamic search type switching (players/clubs)

**Database Insights Panel**:

- Real-time collection document counts
- Market value distribution across positions
- Transfer activity metrics
- Player distribution by clubs and positions

---

## 🔧 API Architecture

### Endpoints Overview

| Endpoint            | Method | Purpose                 | MongoDB Operations                  |
| ------------------- | ------ | ----------------------- | ----------------------------------- |
| `/api/player-stats` | GET    | Player analytics        | Aggregation, grouping, lookups      |
| `/api/transfers`    | GET    | Transfer market data    | Multi-collection joins              |
| `/api/matches`      | GET    | Match results & filters | Date queries, conditional filtering |
| `/api/search`       | GET    | Search & analytics      | Text search, regex patterns         |

### Advanced MongoDB Features Used

- **Aggregation Pipelines**: Complex data transformations
- **$lookup**: Multi-collection joins
- **$group**: Statistical calculations
- **$match**: Dynamic filtering
- **$sort**: Optimized sorting
- **$addFields**: Computed fields
- **Conditional Logic**: Smart data handling

## 🎨 Design System

### Color Palette

- **Primary**: Blue (`blue-600`, `blue-500`)
- **Secondary**: Green (`green-600`, `green-500`)
- **Accent**: Purple (`purple-600`, `purple-500`)
- **Background**: Gray (`gray-900`, `gray-800`)
- **Text**: White, Gray variants

### Components

- Consistent card layouts
- Responsive grid systems
- Interactive hover states
- Loading states
- Error handling

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**: `sm`, `md`, `lg`, `xl`
- **Grid systems**: Responsive column layouts
- **Navigation**: Mobile-friendly interface

## 🔒 Data Flow

1. **Client Request** → Next.js Page (Server Component)
2. **Server-side Fetch** → API Route Handler
3. **Database Query** → MongoDB Aggregation
4. **Data Processing** → Transform and validate
5. **Response** → JSON data to client
6. **Rendering** → React components with data

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

```env
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/footballhub
NODE_ENV=production
```

## 📈 Performance Optimizations

- **Server Components**: Reduced JavaScript bundle
- **Database Indexing**: Optimized queries
- **Image Optimization**: Next.js built-in optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: API route caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ashbourn D'Cunha**

- GitHub: [@your-github-username](https://github.com/your-github-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-linkedin)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the powerful database platform
- Tailwind CSS for the utility-first CSS framework
- The React community for continuous inspiration

---

**⚽ Built with passion for football and modern web development!**# football-hub
