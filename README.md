# Collectables Frontend

A modern web application for managing and tracking Pokemon card collections. Built with React and Vite, this application allows users to explore Pokemon card sets, manage their collections, and track card prices.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jchun247/collectables-frontend.git
cd collectables-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add necessary environment variables (see [Environment Variables](#environment-variables) section below)

## Running the Application

To run the application locally:

```bash
npm run dev
```

This will start the development server, typically at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build:data` - Fetches and builds Pokemon card set data
- `npm run build` - Builds the data and creates a production build
- `npm run build:staging` - Creates a staging environment build
- `npm run lint` - Runs ESLint to check code quality
- `npm run preview` - Previews the production build locally

## Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** 
  - Radix UI primitives
  - Custom components in `src/components/ui`
- **Authentication:** Auth0
- **Data Visualization:** Recharts
- **Type Checking:** TypeScript
- **Routing:** React Router DOM
- **HTTP Client:** Fetch API

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── utils/         # Utility functions
├── lib/           # Library code
├── assets/        # Static assets
└── data/          # Data files
```

## Development

1. Make sure to run `npm run build:data` before starting development to fetch the latest card set data
2. The application uses ESLint for code quality. Run `npm run lint` to check for issues
3. Components use a combination of Radix UI primitives and custom components

## Environment Variables

The following environment variables are required to be set in a `.env` file:

```
VITE_API_BASE_URL        # Base URL for the API endpoints
VITE_AUTH0_DOMAIN        # Auth0 domain for authentication
VITE_AUTH0_CLIENT_ID     # Auth0 client ID
VITE_AUTH0_AUDIENCE      # Auth0 API audience identifier
```

For the build script, additional variables are needed:
```
API_BASE_URL           # API base URL for build time
BUILD_TOKEN            # Authentication token for the API
```

## Building for Production

1. Ensure all environment variables are properly set
2. Run the build command:
```bash
npm run build
```

3. The built files will be in the `dist` directory

## Staging Environment

For staging deployments, use:
```bash
npm run build:staging
```

This will create a build with staging-specific configurations.
