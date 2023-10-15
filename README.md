# Product Case Study

A (not-so) simple Product and Order Management system.

## Getting Started

### Prereqs

Create a .env file with the following variables

```env
## The url to your postgres db...
PRISMA_DB=""

## direct url to postgres db. locally can be same as PRISMA_DB
POSTGRES_URL_NON_POOLING=""

## Used for querying the GQL BE
NEXT_PUBLIC_URL="http://localhost:3000"

## Maps API Key. Not required
NEXT_PUBLIC_GOOGLE_MAPS_KEY=""
```

### Install

```sh
pnpm i
```

### Seed DB

```sh
  pnpm db:push
```

### Run

```sh
pnpm dev
```

### Visit the site

```web
http://localhost:3000
```

### Make some GQL Queries

```web
http://localhost:3000/api/graphql
```

## Tech

### Frontend

- Next.js 13 (the one with the app router...)
- Mantine (Core, Forms, Notifications, Modals)
- Tabler Icons
- date-fns
- Apollo Client

### Backend

- Next.js 13 (because API routes are cool)
- GraphQL Yoga
- Prisma
- Pothos + Prisma Plugin
- Vercel Postgres DB

### Hosting

- Vercel

### Integrations

- Auth0
- Google Maps API
- Prisma Accelerate