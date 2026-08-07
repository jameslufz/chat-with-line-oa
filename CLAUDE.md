@AGENTS.md

## Project Overview
This is a project about chat with `LINE Official Account` or `LINE OA` (Messaging API). In folder `./app/api/v1/hook` will be handled webhook from LINE OA.

## Tech Stack
- Next.js 16.3.0 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Supabase

## Project Structure
- `app/` - routes and layouts
- `lib/` - libaries such as Supabase
- `public/` - static assets

## Commands
- `npm run dev` - for local dev
- `npm run build`
- `npm run lint`
- `npm run test`

<!-- ## Conventions -->

## Code Style
- always indent 4 tabs
- functional components + TypeScript
- async/await only never use .then()
- early return pattern