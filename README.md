# Analytics Dashboard

A modern analytics dashboard with global and local filter capabilities, built with Next.js, tRPC, and PostgreSQL.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, tRPC, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Chart.js with React Chart.js 2
- **UI Components**: Shadcn/ui
- **Testing**: Jest with React Testing Library
- **Validation**: Zod schemas for type-safe validation

## 📋 Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- npm or pnpm

## 🛠️ Getting Started

### 1. Database Setup

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port `5432` with the following default credentials:
- **Database**: `mydatabase`
- **Username**: `myuser`
- **Password**: `mypassword`

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

The backend will be available at `http://localhost:8000`.

### 3. Frontend Setup

In a new terminal, navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## 🎯 Usage

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
2. The dashboard will load with sample data and interactive charts
3. Use the global filter bar to filter data across all charts
4. Individual charts also support local filtering that overrides global filters

## 🏗️ Architecture Overview

### Filter System Design

The dashboard implements a sophisticated filter system with both global and local scopes:

- **Global Filters**: Applied across all charts via React Context
- **Local Filters**: Chart-specific overrides stored per component
- **Filter Resolution**: Local filters take precedence over global ones
- **Persistence**: Filter states are saved to PostgreSQL database
- **Debouncing**: API calls are debounced (500ms) to prevent excessive requests

### Component Structure

```
Dashboard
├── GlobalFilterProvider (Context)
├── GlobalFilterBar 
└── DashboardGrid
    ├── NoOfEmployeesChart (Bar Chart)
    ├── AverageTenureChart (Line Chart)
    └── EmploymentTypeChart (Pie Chart)
```

Each chart component:
- Connects to global filter context
- Maintains local filter state with scope-based persistence
- Resolves effective filters (global + local overrides)
- Debounces data fetching requests
- Handles loading/error states gracefully

## 📁 Project Structure

```
dashboard/
├── client/                # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   │   ├── charts/    # Chart components (Bar, Line, Pie)
│   │   │   ├── filters/   # Filter components
│   │   │   └── ui/        # Shadcn/ui components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── mocks/         # Mock API for development
├── server/                # Backend application
│   ├── src/
│   │   ├── routes/        # tRPC routers
│   │   ├── services/      # Business logic services
│   │   └── config/        # Configuration files
│   └── prisma/            # Database schema and migrations
└── docker-compose.yml     # Database configuration
```

## 🧪 Testing

Run tests for the frontend:

```bash
cd client
npm test
```

The project includes:
- Unit tests for filter resolution logic
- Input validation and sanitization tests
- Component testing infrastructure with Jest and React Testing Library

## 📊 Features

### Charts
- **Bar Chart**: Employee count over time
- **Line Chart**: Average tenure trends
- **Pie Chart**: Employment type distribution

### Filtering
- **Date Range**: Filter by date periods
- **Employment Type**: Full-time, Part-time, Contractor, Intern
- **Work Arrangement**: Hybrid, On-site, Remote
- **Location**: Text-based location filtering
- **Tenure**: Minimum years of experience

### User Experience
- Real-time filter updates
- Loading states with skeleton components
- Error handling with retry functionality
- Responsive design for mobile and desktop
- Consistent theming with dark/light mode support

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Input validation and sanitization
- Error boundaries for graceful error handling

### Performance
- React.memo for chart components
- Debounced API calls
- Efficient re-rendering with proper dependencies
- Chart.js optimization with component registration

## 👨‍💻 Author

**Frederik Haas**
- GitHub: [@FreddyHaas](https://github.com/FreddyHaas)
- Repository: [dashboard](https://github.com/FreddyHaas/dashboard-frontend)

