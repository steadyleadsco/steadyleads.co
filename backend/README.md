# Steady Leads Backend API

Express.js + PostgreSQL API for Steady Leads lead generation platform.

## Setup

### Requirements
- Node.js 18+ LTS
- PostgreSQL 13+
- Environment variables set on VPS host

### Environment Variables

Set on the VPS host (not in .env):
```bash
export DB_HOST="postgres"
export DB_PORT="5432"
export DB_NAME="openclaw"
export DB_USER="openclaw_dba"
export DB_PASSWORD="..."
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts API on http://localhost:3000

### Build

```bash
npm run build
```

Compiles TypeScript to `dist/`

### Production

```bash
npm run build
npm start
```

## Database

### Migrations

Migrations are stored in `/migrations/` as SQL files.

To run migrations:
```bash
npm run migrate
```

### Schema

See `/migrations/001-initial-schema.sql` for table structure.

Tables:
- `clients` — Client companies
- `client_settings` — Client-specific configuration
- `leads` — Generated leads
- `lead_history` — Lead status changes
- `landing_pages` — Dynamic landing pages
- `landing_page_submissions` — Form submissions
- `invoices` — Client invoices
- `audit_log` — All system actions

## API Endpoints

(To be built)

### Health Check
```
GET /health
```

Returns API status.

## Architecture

- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Auth:** JWT (to be implemented)
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting

## Testing

```bash
npm test
```

## Deployment

Docker Compose handles deployment. See `docker-compose.yml` in root.

## Sensitive Data

**Never commit to GitHub:**
- Database passwords
- JWT secrets
- API tokens
- SMTP credentials

Use environment variables instead.
