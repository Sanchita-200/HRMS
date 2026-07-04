# AI-HRMS Frontend - Next.js

This is the Next.js App Router frontend for the AI-Powered Human Resource Management System (AI-HRMS).

## Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Vanilla CSS variables
- **Components:** shadcn/ui primitives + Framer Motion for animations
- **Language:** TypeScript (Strict Mode)

## Directory Layout

- `/app`: App Router entries (layouts, pages, route configurations).
- `/components`: Custom reusable components.
  - `/components/ui`: Primitive widgets imported from Radix UI / shadcn template models.
  - `/components/common`: Shared app layout wrappers (headers, sidebars, shell containers).
- `/hooks`: Custom state management and react hooks.
- `/lib`: Helper libraries, theme setups, API wrappers, client configs.
- `/services`: Domain API fetch services.
- `/types`: Type interfaces for database outputs and custom structures.
- `/styles`: Global CSS declarations and styling tokens.
- `/public`: Static media, icons, and vectors.

## Installation & Setup

Ensure Node.js v18.0.0+ is installed locally.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will run on `http://localhost:3000`.

## Architecture Guide

1. **Keep App Directory Lean:** Write pages inside `app/` and split layout elements into `components/`.
2. **Reuse UI Primitives:** Check `/components/ui` for existing shadcn widgets before introducing external HTML/CSS files.
3. **No Direct Fetching in Pages:** Wrap all backend requests inside `services/` and fetch data using custom hooks.
