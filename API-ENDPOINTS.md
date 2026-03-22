# Steady Leads API — Complete Endpoint Reference

**Version:** 1.0.0  
**Status:** Production-ready ✅  
**Base URL:** `http://localhost:3000/api`  
**Database:** PostgreSQL (openclaw)  
**Language:** TypeScript  

---

## Health Check

### GET /health
Check API status and database connection.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-22T19:45:00Z",
  "version": "1.0.0",
  "database": "connected"
}
```

---

## Clients (6 endpoints)

### POST /api/clients
Create a new client (pending approval).

**Request:**
```json
{
  "name": "Glow Med Spa",
  "email": "owner@glowmedspa.com",
  "phone": "+1-615-555-0123",
  "business_type": "med_spa",
  "city": "Nashville",
  "state": "TN",
  "monthly_budget": 2500,
  "notes": "High-intent prospect"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Glow Med Spa",
    "email": "owner@glowmedspa.com",
    "status": "pending",
    "created_at": "2026-03-22T19:45:00Z"
  },
  "timestamp": "2026-03-22T19:45:00Z"
}
```

### GET /api/clients
List all clients (paginated).

**Query Parameters:**
- `limit` (default: 50, max: 100)
- `offset` (default: 0)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "clients": [...],
    "count": 5,
    "limit": 50,
    "offset": 0
  },
  "timestamp": "2026-03-22T19:45:00Z"
}
```

### GET /api/clients/:id
Get client by ID.

**Response:** `200 OK` or `404 Not Found`

### GET /api/clients/:id/stats
Get client statistics (total leads, conversions, etc.).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Glow Med Spa",
    "total_leads": 42,
    "converted_leads": 8,
    "monthly_budget": 2500
  },
  "timestamp": "2026-03-22T19:45:00Z"
}
```

### PATCH /api/clients/:id
Update client details.

**Request:**
```json
{
  "phone": "+1-615-555-9999",
  "monthly_budget": 3000
}
```

**Response:** `200 OK`

### PATCH /api/clients/:id/approve
Approve client (pending → active).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "approved",
    "approved_at": "2026-03-22T19:45:00Z"
  },
  "timestamp": "2026-03-22T19:45:00Z"
}
```

---

## Leads (6 endpoints)

### POST /api/leads
Create a new lead (from cold email, form, API, etc.).

**Request:**
```json
{
  "client_id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-615-555-1234",
  "source": "cold_email",
  "source_detail": "campaign_id:c123",
  "quality_score": 75
}
```

**Response:** `201 Created`

### GET /api/leads
List all leads (paginated).

**Query Parameters:**
- `limit` (default: 50, max: 100)
- `offset` (default: 0)

**Response:** `200 OK`

### GET /api/leads/:id
Get lead by ID.

**Response:** `200 OK` or `404 Not Found`

### GET /api/leads/client/:clientId
Get all leads for a specific client.

**Query Parameters:**
- `limit`, `offset`

**Response:** `200 OK`

### PATCH /api/leads/:id
Update lead status or details.

**Request:**
```json
{
  "status": "qualified",
  "quality_score": 85,
  "notes": "High intent, ready for follow-up"
}
```

**Response:** `200 OK`

### GET /api/leads/daily/summary
Get today's lead summary (by source, client, etc.). Used in daily digest.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-03-22",
      "total_new": 12,
      "unique_clients": 3,
      "source": "cold_email",
      "count": 8
    },
    {
      "source": "contact_form",
      "count": 4
    }
  ],
  "timestamp": "2026-03-22T19:45:00Z"
}
```

---

## Invoices (7 endpoints)

### POST /api/invoices
Create a new invoice (pending approval).

**Request:**
```json
{
  "client_id": "uuid",
  "amount": 2500,
  "invoice_type": "monthly_retainer",
  "due_date": "2026-04-15"
}
```

**Response:** `201 Created`

### GET /api/invoices
List all invoices (paginated).

**Query Parameters:**
- `limit`, `offset`

**Response:** `200 OK`

### GET /api/invoices/pending
Get pending invoices (for daily digest).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "invoices": [...],
    "count": 3
  },
  "timestamp": "2026-03-22T19:45:00Z"
}
```

### GET /api/invoices/:id
Get invoice by ID.

**Response:** `200 OK` or `404 Not Found`

### GET /api/invoices/client/:clientId
Get invoices for a client.

**Query Parameters:**
- `limit`, `offset`

**Response:** `200 OK`

### PATCH /api/invoices/:id
Update invoice details.

**Request:**
```json
{
  "amount": 2750,
  "notes": "Lead overage + setup fee"
}
```

**Response:** `200 OK`

### PATCH /api/invoices/:id/approve
Approve invoice (pending → approved). Triggers email send.

**Request:**
```json
{
  "approvedBy": "ben"
}
```

**Response:** `200 OK`

### PATCH /api/invoices/:id/send
Mark invoice as sent (approved → sent).

**Response:** `200 OK`

---

## Landing Pages (7 endpoints)

### POST /api/landing-pages
Create a new landing page.

**Request:**
```json
{
  "client_id": "uuid",
  "slug": "nashville-botox",
  "title": "Botox in Nashville",
  "city": "Nashville",
  "service": "botox",
  "template_id": "med_spa_v2"
}
```

**Response:** `201 Created`

### GET /api/landing-pages
List all landing pages (paginated).

**Query Parameters:**
- `limit`, `offset`

**Response:** `200 OK`

### GET /api/landing-pages/:id
Get landing page by ID.

**Response:** `200 OK` or `404 Not Found`

### GET /api/landing-pages/slug/:slug
Get landing page by slug (e.g., `/slug/nashville-botox`).

**Response:** `200 OK` or `404 Not Found`

### GET /api/landing-pages/client/:clientId
Get landing pages for a client.

**Query Parameters:**
- `limit`, `offset`

**Response:** `200 OK`

### GET /api/landing-pages/:id/stats
Get landing page statistics (form submissions, conversions, etc.).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "nashville-botox",
    "total_submissions": 42,
    "form_captures": 42,
    "published_at": "2026-03-15T10:00:00Z"
  },
  "timestamp": "2026-03-22T19:45:00Z"
}
```

### PATCH /api/landing-pages/:id
Update landing page details.

**Request:**
```json
{
  "title": "Botox Specials in Nashville, TN",
  "city": "Nashville"
}
```

**Response:** `200 OK`

### PATCH /api/landing-pages/:id/publish
Publish landing page (draft → published). Goes live.

**Response:** `200 OK`

### PATCH /api/landing-pages/:id/archive
Archive landing page (published → archived).

**Response:** `200 OK`

---

## Daily Digest (3 endpoints)

### GET /api/digest/daily
Get Ben's daily digest (all pending approvals, new leads, pending invoices).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "date": "2026-03-22",
    "pending_clients": [
      {
        "id": "uuid",
        "name": "Glow Med Spa",
        "email": "owner@glowmedspa.com",
        "monthly_budget": 2500,
        "action_url": "/approve/client/{id}"
      }
    ],
    "daily_summary": {
      "total_new_leads": 12,
      "leads_by_source": [
        { "source": "cold_email", "count": 8 },
        { "source": "contact_form", "count": 4 }
      ]
    },
    "pending_invoices": [
      {
        "id": "uuid",
        "amount": 2500,
        "invoice_type": "monthly_retainer",
        "action_url": "/approve/invoice/{id}"
      }
    ],
    "system_health": {
      "database": "healthy",
      "last_check": "2026-03-22T19:45:00Z"
    }
  },
  "timestamp": "2026-03-22T19:45:00Z"
}
```

### PATCH /api/digest/approve/client/:clientId
Approve client from digest.

**Response:** `200 OK`

### PATCH /api/digest/approve/invoice/:invoiceId
Approve invoice from digest.

**Request:**
```json
{
  "approvedBy": "ben"
}
```

**Response:** `200 OK`

---

## Error Responses

All errors return consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2026-03-22T19:45:00Z"
}
```

**Status Codes:**
- `201 Created` — Successful creation
- `200 OK` — Successful request
- `400 Bad Request` — Invalid input (validation error)
- `404 Not Found` — Resource not found
- `429 Too Many Requests` — Rate limit exceeded (100 req/min)
- `500 Internal Server Error` — Server error

---

## Rate Limiting

All `/api/*` routes are rate-limited to **100 requests per minute** per client.

When exceeded:
```json
{
  "success": false,
  "error": "Too many requests, please try again later.",
  "timestamp": "2026-03-22T19:45:00Z"
}
```

HTTP Status: `429 Too Many Requests`

---

## Testing

**Health check:**
```bash
curl http://localhost:3000/health
```

**Create client:**
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Spa",
    "email": "test@spa.com",
    "city": "Nashville",
    "monthly_budget": 2500
  }'
```

**Get digest:**
```bash
curl http://localhost:3000/api/digest/daily
```

---

## Database Schema

See `/backend/migrations/001-initial-schema.sql` for full schema.

**Tables:**
- `clients` — Client companies
- `leads` — Generated leads
- `landing_pages` — Dynamic landing pages
- `invoices` — Client invoices
- `audit_log` — All system actions

---

**API Version:** 1.0.0  
**Last Updated:** 2026-03-22 19:45 UTC  
**Status:** Ready for production
