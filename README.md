# PaiTiew

PaiTiew is a Phuket-focused local discovery MVP that connects tourism, local communities, OTOP products, services, and quest-based travel experiences. The project is designed as a medium between visitors and local partners, with a focus on sustainable tourism, community value, and responsible local commerce.

## Concept

PaiTiew starts with Phuket as the MVP location.

The platform focuses on:

- Helping users discover local villages and community places
- Promoting OTOP products and local services
- Supporting tourism experiences through quest-based discovery
- Creating a scalable foundation for future marketplace, rewards, and partner systems

Core idea:

```txt
User → Discover local place → Explore village/product/service → Start quest → Earn reward / support local community
```

## Current Features

- Authentication UI
  - Login page
  - Sign-up page
  - Google provider login UI/backend redirect support
- Backend authentication API
  - Email/password login
  - Email/password sign-up
  - Google OAuth through Supabase
  - Zod request validation
- Main user layout
  - Sidebar navigation
  - Top bar
  - Mobile sidebar drawer
  - Responsive layout helper
- OTOP discovery page
  - Village carousel
  - Product & Service carousel
  - Frontend-only category filtering
  - Static mock data
  - Start Quest button from village cards
- Placeholder routes
  - Home
  - OTOP
  - Market
  - Quest
  - Reward
  - Settings

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Lucide React
- React Icons
- Inter font
- Vercel-ready deployment

### Backend

- Node.js
- Express
- TypeScript
- Zod
- CORS
- Helmet
- Morgan
- Supabase Auth
- Nodemon / ts-node-dev for development
- Render-ready deployment

### External Services

- Supabase
  - Authentication
  - Google OAuth provider
- Vercel
  - Frontend deployment
- Render
  - Backend deployment

## Project Structure

```txt
paitiew/
  frontend/
    app/
      (main)/
        home/
        otop/
        market/
        quest/
        reward/
        settings/
      login/
      sign-up/
    components/
      auth/
      layout/
      otop/
    lib/

  backend/
    src/
      controllers/
      routes/
      services/
      lib/
      env.ts
      app.ts
      server.ts
```

## Environment Variables

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

For production:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
```

### Backend `.env`

```env
NODE_ENV=development
PORT=3001
HOST=127.0.0.1

CORS_ORIGIN=http://localhost:3000

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

AUTH_GOOGLE_REDIRECT_URL=http://127.0.0.1:3001/authen/google/callback
AUTH_SUCCESS_REDIRECT_URL=http://localhost:3000
AUTH_ERROR_REDIRECT_URL=http://localhost:3000/login
```

For production:

```env
NODE_ENV=production
PORT=10000
HOST=0.0.0.0

CORS_ORIGIN=https://your-frontend-url.vercel.app

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

AUTH_GOOGLE_REDIRECT_URL=https://your-backend-url.onrender.com/authen/google/callback
AUTH_SUCCESS_REDIRECT_URL=https://your-frontend-url.vercel.app
AUTH_ERROR_REDIRECT_URL=https://your-frontend-url.vercel.app/login
```

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://127.0.0.1:3001
```

## Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm run build
npm start
```

## Authentication Flow

### Email Sign-up

```txt
Frontend sign-up form
→ Backend /authen/signup
→ Zod validation
→ Supabase Auth signUp
→ Return response to frontend
```

### Email Login

```txt
Frontend login form
→ Backend /authen/login
→ Zod validation
→ Supabase Auth signInWithPassword
→ Return session/user data
```

### Google OAuth

```txt
User clicks Continue with Google
→ Frontend redirects to backend Google auth route
→ Backend asks Supabase for OAuth URL
→ Supabase redirects to Google consent screen
→ Google redirects back to Supabase
→ Supabase redirects to backend callback
→ Backend redirects to frontend success/error URL
```

## OTOP Filtering Logic

The OTOP feature currently uses frontend-only filtering.

```txt
Click category chip
→ Update selectedCategory state
→ Filter villages by category
→ Filter product/services by category
→ Re-render both carousels
```

No backend API is required for this MVP version.

## MVP Scope

This project currently focuses on UI/UX, authentication foundation, and mock OTOP discovery data.

Not included yet:

- Real product database
- Real village database
- Payment system
- Reward engine
- Quest completion logic
- Admin dashboard
- Partner management system

## Future Roadmap

- Connect OTOP data to backend database
- Add location-based nearby discovery
- Add quest tracking system
- Add reward points
- Add user profile
- Add partner/admin dashboard
- Add marketplace checkout
- Add analytics for local business partners

## Deployment Notes

### Vercel Frontend

Recommended settings:

```txt
Root Directory: frontend
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: .next
```

### Render Backend

Recommended settings:

```txt
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

Important:

```env
HOST=0.0.0.0
```

Render requires the backend server to bind to `0.0.0.0`, not `127.0.0.1`.

## Security Notes

- Do not commit `.env` files
- Use `.env.example` for shared environment documentation
- Supabase anon key can be public, but service role keys must never be exposed to frontend
- Backend should validate all incoming requests with Zod
- OAuth redirect URLs must be added to Supabase allow list

## Status

MVP in active development.
```
