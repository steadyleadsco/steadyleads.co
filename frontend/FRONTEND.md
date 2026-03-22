# Steady Leads - Next.js Frontend

Production-ready Next.js frontend for Steady Leads lead generation platform.

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your API URL

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── pages/                 # Next.js page routes
│   ├── index.tsx         # Landing page
│   ├── pricing.tsx       # Pricing page
│   ├── about.tsx         # About page
│   ├── dashboard/        # Protected dashboard routes
│   │   ├── index.tsx     # Dashboard home
│   │   ├── login.tsx     # Login page
│   │   ├── clients.tsx   # Client management
│   │   ├── leads.tsx     # Leads list & filter
│   │   ├── invoices.tsx  # Invoice management
│   │   └── digest.tsx    # Daily digest view
│   ├── _app.tsx          # App wrapper
│   └── _document.tsx     # HTML document
├── components/
│   └── Layout.tsx        # Public & Dashboard layouts
├── lib/
│   ├── api.ts           # API client & SWR hooks
│   └── utils.ts         # Utility functions
├── types/
│   └── index.ts         # TypeScript types
└── styles/
    └── globals.css      # Global Tailwind styles
```

## Features

### Public Pages
- **Landing Page** (`/`) - Hero, problem/solution, proof, pricing, CTA, FAQ
- **Pricing** (`/pricing`) - Detailed pricing, features, FAQ
- **About** (`/about`) - Company story, values, guarantee

### Dashboard (Protected)
- **Login** (`/dashboard/login`) - Email/password authentication
- **Dashboard Home** (`/dashboard`) - Key metrics, quick actions
- **Clients** (`/dashboard/clients`) - List, create, approve clients
- **Leads** (`/dashboard/leads`) - Filter by client/status, view lead details
- **Invoices** (`/dashboard/invoices`) - View, approve invoices
- **Daily Digest** (`/dashboard/digest`) - Daily summary, top clients, pending items

## API Integration

The frontend connects to the backend API at `NEXT_PUBLIC_API_URL` (default: `http://localhost:3000/api`).

### API Client (`lib/api.ts`)

#### Auth
```typescript
login(email, password)        // Login user
logout()                       // Logout (clears token)
useAuth()                      // Hook to get current user
```

#### Clients
```typescript
useClients(page, limit)        // Get paginated clients
useClient(id)                  // Get single client
createClient(data)             // Create new client
updateClient(id, data)         // Update client
approveClient(id)              // Approve pending client
```

#### Leads
```typescript
useLeads(clientId, page, limit) // Get leads with optional client filter
useLead(id)                      // Get single lead
createLead(data)                 // Create lead
updateLead(id, data)             // Update lead status
```

#### Invoices
```typescript
useInvoices(clientId, page)      // Get invoices
useInvoice(id)                   // Get single invoice
approveInvoice(id)               // Approve invoice
```

#### Dashboard
```typescript
useDashboardMetrics()            // Get metrics
useDailyDigest(date)             // Get daily digest
```

## Authentication

- JWT token stored in localStorage
- Authorization header: `Authorization: Bearer {token}`
- Protected routes redirect to `/dashboard/login` if not authenticated
- Token passed in `Authorization` header for all API calls

## Styling

- **Tailwind CSS** for utility-first styling
- **Color scheme**: Navy (#0f172a), Green (#10b981)
- **Responsive**: Mobile-first design, optimized for all devices
- **Custom components**: Global CSS includes `.btn-primary`, `.card`, `.input`, `.badge` classes

## Configuration Files

### `tailwind.config.js`
- Extends with custom navy and green colors
- Configured for all source files in src/

### `postcss.config.js`
- Tailwind CSS + autoprefixer

### `next.config.js`
- Default Next.js configuration
- Optimized for production

### `.env.example`
Copy to `.env.local` and configure:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_AUTH_REDIRECT=/dashboard
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Docker

### Build
```bash
docker build -t steadyleads-web .
```

### Run
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000/api \
  steadyleads-web
```

### Docker Compose
```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000/api
```

## TypeScript Types

All types are defined in `src/types/index.ts`:

```typescript
User              // Authenticated user
Client            // Med spa client
Lead              // Lead from a client
Invoice           // Invoice record
DashboardMetrics  // Dashboard key metrics
DailyDigest       // Daily summary data
```

## Performance Optimizations

- Image optimization via Next.js `Image` component
- Code splitting by page
- SWR for efficient data fetching & caching
- CSS-in-JS with Tailwind (zero runtime overhead)

## Development Notes

### Adding a New Page

1. Create file in `src/pages/dashboard/[name].tsx`
2. Use `DashboardLayout` for protected pages
3. Use `PublicLayout` for public pages
4. Import types from `@/types`
5. Use hooks from `@/lib/api`

### Adding a New API Endpoint

1. Define type in `src/types/index.ts`
2. Add fetcher function in `src/lib/api.ts`
3. Create hook wrapper with SWR
4. Use hook in component

### Environment Variables

All `NEXT_PUBLIC_*` variables are exposed to the client. Never put secrets here.

## Troubleshooting

### "Cannot GET /dashboard"
- Make sure you're logged in (check localStorage for `authToken`)
- API must be running on the configured URL

### "API Error"
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify backend is running
- Check browser console for details

### TypeScript Errors
```bash
npm run type-check
```

## Production Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t steadyleads:latest .
docker run -p 80:3000 steadyleads:latest
```

### Environment Setup
Always set `NEXT_PUBLIC_API_URL` to your production API URL before deploying.

## License

© 2024 Steady Leads. All rights reserved.
