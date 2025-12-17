# KMP UI Assignment

## Prerequisites

- Node.js >= 20.x (recommended: 20.5)
- npm >= 9.x
- Optional: VS Code or any IDE with TypeScript support

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS for styling
- React Hook Form + Zod for form handling and validation
- TanStack Query for data fetching and caching
- Lodash (for debounce)
- Lucide React (for icons)
- React Select / AsyncSelect (for filters multi-select)

## Architecture

- **Pages**: Orchestrate data fetching, state, and layout.
- **Components**: Pure presentational UI components (FiltersPanel, SkeletonCard, etc.).
- **Hooks**: Encapsulate logic for search, categories, and tags (`useSearchDocuments`, `useCategories`, `fetchTags`).
- **State**: URL is the source of truth for search state (query, filters, pagination).
- **Styles**: Tailwind classes for responsive design, transitions, and layouts.

## Features

- Multi-step upload wizard with drag & drop
- Form validation with persistence (React Hook Form + Zod)
- Search with debounce for smooth typing experience
- Filters with categories and tags (multi-select), collapsible on mobile
- Pagination with dynamic page numbers and smooth navigation
- Mock APIs with delay and error simulation for testing

## Setup and Run

1. Clone the repository:
   ```bash
   git clone https://github.com/lilas-apollo/KMP-UI.git
   cd kmp-ui
   npm install
   npm run dev
   ```
