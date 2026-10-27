# MEVN Blog Application Backend API

## Description
This is the Node.js/Express REST API backend for the MEVN Blog Application. It supports JWT user authentication, password hashing with bcryptjs, blog post CRUD operations, commenting, role-based deletion for Admins, and restriction preventing non-author updates.

## Setup Instructions
1. Ensure MongoDB is running locally (`mongodb://127.0.0.1:27017/mevn_blog`) or update `MONGO_URI` in `.env`.
2. Run `npm install` inside the `server/` directory.
3. Start dev server: `npm run dev`

## Default Test Credentials & Roles
To test Admin permissions vs Regular user permissions, you can register through the API/Frontend or manually create accounts:

### Admin Account (Example)
- **Email:** `admin@example.com`
- **Username:** `admin`
- **Password:** `password123`
- **isAdmin:** `true`

### Regular User Account (Example)
- **Email:** `john@example.com`
- **Username:** `john_doe`
- **Password:** `password123`
- **isAdmin:** `false`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user (`username`, `email`, `password`, optional `isAdmin`)
- `POST /api/users/login` - Login user (`email`, `password`)

### Blog Posts
- `GET /api/posts` - Fetch all blog posts (Public)
- `GET /api/posts/:id` - Fetch single post by ID (Public)
- `POST /api/posts` - Create post (Protected)
- `PUT /api/posts/:id` - Update post (Protected, Creator ONLY)
- `DELETE /api/posts/:id` - Delete post (Protected, Creator OR Admin)
- `POST /api/posts/:id/comments` - Add comment to post (Protected)