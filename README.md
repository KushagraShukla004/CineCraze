# CineCraze - Movie Browsing Web Application

## Project Overview

CineCraze is a comprehensive movie browsing web application that enables users to search, filter, and explore movies using the TMDB API. The application features user authentication, favorite movie management, and detailed movie information with performance optimizations and responsive design.

## Features

- **User Authentication**: Signup, login, and logout functionality
- **Movie Browsing**: Browse popular, top-rated, and upcoming movies
- **Search & Filtering**: Search by title with debouncing, filter by genre/year/rating
- **Favorites Management**: Save/remove favorite movies with localStorage persistence
- **Dark Mode**: Theme toggle with persistent user preference
- **Infinite Scrolling**: Manual implementation for movie listings
- **Detailed Movie Pages**: Comprehensive movie information with lazy loading

## Tech Stack

- **Frontend**: React, Redux Toolkit, React Router
- **Backend**: Node.js, Express
- **State Management**: Redux with redux-persist
- **Styling**: Tailwind CSS with custom theming
- **API**: TMDB API for movie data

## Project Structure

```
CineCraze/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── redux/      # Redux store and slices
│   │   ├── hooks/      # Custom React hooks
│   │   └── ...
├── backend/           # Node.js server
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── ...
└── README.md          # This file
```

## Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
cd frontend && npm install
cd ../backend && npm install
```

3. Create a `.env` file in both frontend and backend directories with required environment variables

## Running the Application

1. Start the backend server:

```bash
cd backend && npm start
```

2. Start the frontend development server:

```bash
cd frontend && npm run dev
```

## Testing

Run tests for both frontend and backend:

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

## Deployment

### Frontend

Deploy to Vercel/Netlify:

1. Build the production version:

```bash
cd frontend && npm run build
```

2. Deploy the `dist` folder to your preferred hosting service

### Backend

Deploy to services like Render or Railway with proper environment variables set.

## API Documentation

### TMDB API

- Base URL: `https://api.themoviedb.org/3`
- Required API key (set in `.env`)

### Backend API Endpoints

- `/api/auth/*` - Authentication routes
- `/api/movies/*` - Movie data routes
- `/api/favorites/*` - Favorites management

## Future Enhancements

- Implement user profiles
- Add movie recommendations
- Enable social features (reviews, ratings)
- Expand testing coverage

## License

MIT
