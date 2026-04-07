# Rehacktor - Gaming Discovery Platform

Web application built with React, Vite, RAWG API and Supabase that allows users to discover video games, browse live catalog data, save favourites and publish reviews.

Final project developed during the Aulab specialization path.

## Features

- Live videogame catalog powered by RAWG API
- Search page with dynamic suggestions
- Browse by genre
- Trending and top-rated views
- Dedicated game detail page with screenshots, ratings and metadata
- User authentication with Supabase
- Personal profile page
- Username editing and avatar upload
- Favourite games management
- User reviews for each game
- Responsive interface
- Graceful fallback UI when RAWG data is unavailable

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- DaisyUI
- Supabase
- RAWG API
- React Hook Form
- React Icons
- JavaScript
- Git

## Installation

Clone the repository

Install dependencies:

```bash
npm install
```

Create a `.env` file starting from `.env.example` and configure:

```env
VITE_API_KEY=your_rawg_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Supabase Setup

To enable authentication and user features, configure a Supabase project with:

- Authentication enabled
- `profiles` table
- `favourites` table
- `reviews` table
- `avatars` storage bucket

## Project Goal

Rehacktor was created as a final specialization project to combine API integration, routing, authentication and user-generated content inside a gaming-focused interface.
