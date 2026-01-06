# Lufkin Road Middle School Forum

A full-stack forum application for students with DMs, image uploads, and admin moderation.

## Features

- User registration and login
- Forum posts with replies
- Direct messaging (DMs) with real-time updates
- Image uploads for posts and messages
- Admin panel for user and post moderation
- First registered user is automatically made admin

## Tech Stack

- Backend: Node.js, Express, MongoDB, Socket.io
- Frontend: React, React Router
- Image Storage: Cloudinary
- Authentication: JWT

## Setup

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd ../frontend && npm install`
4. Set up environment variables in `backend/.env`:
   - MONGODB_URI: Your MongoDB connection string
   - JWT_SECRET: A secret key for JWT
   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: Your Cloudinary credentials
   - FRONTEND_URL: URL of the frontend (for CORS)
5. Start the backend: `cd backend && npm run dev`
6. Start the frontend: `cd frontend && npm start`

## Deployment on Railway

1. Push this code to GitHub
2. Connect your GitHub repo to Railway
3. Set environment variables in Railway dashboard
4. Deploy

Railway will automatically detect the Node.js app and build it. The backend serves the React build files.

## Usage

- Register a new account (first user is admin)
- Create posts in the forum
- Reply to posts
- Send DMs to other users
- Upload images in posts and DMs
- Admins can moderate users and posts