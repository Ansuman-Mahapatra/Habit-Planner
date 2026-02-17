# Habit Planner Backend

## Setup

1.  Create a MongoDB Atlas cluster and get the connection string.
2.  Update `.env` with your `MONGO_URI` and `JWT_SECRET`.
3.  Run `npm install`.
4.  Run `npm start` or `npm run dev`.

## API Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user profile (protected)
- GET `/api/habits` - Get all habits (protected)
- POST `/api/habits` - Create a new habit (protected)
- GET `/api/habits/stats` -Get aggregated stats for dashboard (protected)
- GET `/api/habits/:id` - Get single habit (protected)
- PUT `/api/habits/:id` - Update habit (protected)
- DELETE `/api/habits/:id` - Soft delete habit (protected)
- PATCH `/api/habits/:id/complete` - Toggle completion for today (protected)
