# Phono E-commerce Web Application

## Overview

The Phono web application is an e-commerce platform for buying and selling phones and accessories.

## Features

- User authentication
- Product listing and search
- Product filtering by various criteria (brand, model, price, etc.)
- Product detail pages with specifications
- User profile management
- Favorites system
- Messaging between users
- Product management (create, edit, archive, mark as sold, promote)
- Status indicators for products (active, archived, sold, waiting for approval)
- Conditional UI elements based on product status

## Technical Stack

- Next.js (App Router)
- React
- TypeScript
- Styled Components
- React Query
- Google Maps API
- Axios for API requests

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Key Components

- **User Authentication**: Login, registration, and profile management
- **Product Search**: Search by keyword, brand, model and other criteria
- **Product Management**: Create, edit, archive, promote to TOP
- **Product Detail Page**: Shows complete product information with status indicators and conditional actions
- **User Profile**: Manage user's products, favorites, and personal information

## Recent Improvements

- Fixed hydration issues with Styled Components in Next.js
- Added product management functionality with three-dots menu
- Implemented status indicators for products (sold, archived, waiting for approval)
- Disabled phone number display for products that are not active

## Best Practices

- Server-side rendering with proper styled-components configuration
- TypeScript for type safety
- Responsive design for mobile and desktop
- API data caching and optimistic updates

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
