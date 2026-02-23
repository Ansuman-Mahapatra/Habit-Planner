# HabitFlow Backend Server

This contains the Node.js Express application that manages authentication, habit creation, history tracking, and MongoDB communication.

## Cloud Deployment

The backend API is currently published live on Render at:
**`https://habit-planner.onrender.com`**

This handles all traffic natively from the Android mobile app.

## Local Setup

1. Create a MongoDB Atlas cluster and acquire a `MONGO_URI`.
2. Configure your `.env` file at the root of this folder:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.net/habitplanner
   JWT_SECRET=your_secret_key_here
   ```
3. Run `npm install` to install Express, Mongoose, bcryptjs, and JSONWebToken.
4. Run `npm run dev` to start the backend on your Localhost (Port 5000).

## Wiping the Database

If you wish to completely wipe your remote MongoDB database clean from the terminal:

```bash
node clear.js
```

This safely drops the entire database connection. Be careful, as this data cannot be recovered.

## API Endpoints

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Verify user credentials and generate JWT
- `GET /api/auth/me` - Get authorized user profile
- `GET /api/habits` - Retrieve user habits & historical completions
- `POST /api/habits` - Create a new tracking habit
- `GET /api/habits/stats` - Fetch aggregated streak data and performance
- `GET /api/habits/:id` - Fetch singular habit properties
- `PUT /api/habits/:id` - Alter habit tracking rules
- `DELETE /api/habits/:id` - Remove habit and cleanup tracking
- `PATCH /api/habits/:id/complete` - Toggle historical completion markers
