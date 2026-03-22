# Deployment Guide — Steady Leads API

Deploy the Steady Leads API on Hostinger VPS using Docker Compose.

---

## Prerequisites

1. **Hostinger VPS** running Linux (Ubuntu 20.04+)
2. **Docker** installed
3. **Docker Compose** installed
4. **Traefik reverse proxy** running (you have this)
5. **PostgreSQL** running (you have this)
6. **Environment variables** set on VPS host

---

## Step 1: Clone Repository

```bash
cd /opt
git clone git@github.com:steadyleadsco/steadyleads.co.git
cd steadyleads.co/backend
```

---

## Step 2: Set Environment Variables on VPS Host

```bash
# SSH to your VPS
ssh user@your-vps-ip

# Set database credentials (already done? verify)
export DB_HOST="postgres"
export DB_PORT="5432"
export DB_NAME="openclaw"
export DB_USER="openclaw_dba"
export DB_PASSWORD="your_secure_password"

# Generate JWT secret
export JWT_SECRET=$(openssl rand -base64 32)

# Set GitHub/Telegram tokens (if you have them)
export GITHUB_API_TOKEN="your_token"
export TELEGRAM_BOT_TOKEN="your_token"

# Make permanent (add to ~/.bashrc)
cat >> ~/.bashrc << EOF
export DB_HOST="postgres"
export DB_PORT="5432"
export DB_NAME="openclaw"
export DB_USER="openclaw_dba"
export DB_PASSWORD="your_secure_password"
export JWT_SECRET="$(openssl rand -base64 32)"
export GITHUB_API_TOKEN="your_token"
export TELEGRAM_BOT_TOKEN="your_token"
EOF

source ~/.bashrc
```

---

## Step 3: Verify Environment Variables

```bash
echo $DB_PASSWORD
echo $JWT_SECRET
```

If they're set, proceed. If not, something went wrong — set them again.

---

## Step 4: Verify External Networks

Docker Compose needs to connect to Traefik and postgres networks.

```bash
# Check if traefik network exists
docker network ls | grep traefik-network

# If it doesn't exist, ask your Traefik docker-compose maintainer
# Or: docker network create traefik-network
```

---

## Step 5: Build and Start

```bash
cd /opt/steadyleads.co/backend

# Build Docker image
docker-compose build

# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api

# Test health check
curl http://localhost:3000/health
```

**Expected output:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-22T20:00:00Z",
  "version": "1.0.0",
  "database": "connected"
}
```

---

## Step 6: Test API via Traefik

```bash
# Test via domain (should route through Traefik)
curl https://steadyleads.co/api/health

# Test directly (internal network)
curl http://localhost:3000/health

# Create a test client
curl -X POST https://steadyleads.co/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Spa",
    "email": "test@spa.com",
    "city": "Nashville",
    "monthly_budget": 2500
  }'
```

---

## Step 7: Monitor & Logs

```bash
# View real-time logs
docker-compose logs -f api

# Check health
docker-compose exec api curl http://localhost:3000/health

# Restart if needed
docker-compose restart api

# Stop all containers
docker-compose down

# Clean up (removes containers, keeps volumes)
docker-compose down --remove-orphans
```

---

## Traefik Configuration

The `docker-compose.yml` includes Traefik labels:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.steadyleads-api.rule=Host(`steadyleads.co`) && PathPrefix(`/api`)"
  - "traefik.http.services.steadyleads-api.loadbalancer.server.port=3000"
```

This tells Traefik:
- Route `https://steadyleads.co/api/*` to `steadyleads-api:3000`
- Strip the `/api` prefix before forwarding
- Use SSL/TLS via Let's Encrypt

**No additional Traefik config needed.** It auto-discovers containers.

---

## Database Migrations

Run migrations after startup:

```bash
docker-compose exec api npm run migrate
```

Or manually:

```bash
docker-compose exec api node dist/migrations/migrate.js
```

---

## Updating Code

When there's a new release on GitHub:

```bash
cd /opt/steadyleads.co/backend

# Pull latest code
git pull origin main

# Rebuild image
docker-compose build

# Restart containers
docker-compose up -d

# Verify
curl https://steadyleads.co/api/health
```

---

## Troubleshooting

### Container won't start

```bash
docker-compose logs api
```

Check for:
- Database connection error → Verify DB_PASSWORD
- Port already in use → Check `docker ps`
- Permission error → Run with sudo or fix Docker permissions

### Database connection failed

```bash
# Test postgres connectivity
docker-compose exec api nc -zv $DB_HOST $DB_PORT
```

If fails, postgres isn't running or credentials are wrong.

### Traefik not routing traffic

```bash
# Check Traefik logs
docker logs traefik

# Verify container is on traefik-network
docker inspect steadyleads-api | grep Networks
```

### API is slow

```bash
# Check resource usage
docker stats steadyleads-api

# Check database queries
# (Add slow query logging to postgres)

# Consider upgrading VPS if CPU/RAM maxed
```

---

## Production Checklist

- [ ] Environment variables set (DB_PASSWORD, JWT_SECRET, etc.)
- [ ] SSL/TLS working (https://steadyleads.co)
- [ ] Database connected and migrated
- [ ] Traefik routing traffic correctly
- [ ] Health check endpoint working
- [ ] Logs being collected (docker logs working)
- [ ] Backups configured (postgres dumps)
- [ ] Monitoring set up (optional but recommended)

---

## SSL/TLS Certificates

Traefik handles SSL automatically via Let's Encrypt.

Verify:
```bash
curl -I https://steadyleads.co/api/health
# Should show: HTTP/2 200
```

Certificates are stored in Traefik's data directory (usually `/data/acme.json`).

---

## Backup Strategy

Backup PostgreSQL regularly:

```bash
# Manual backup
docker exec postgres pg_dump -U openclaw_dba openclaw > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i postgres psql -U openclaw_dba openclaw < backup_20260322.sql
```

Set up automated backups (cron):

```bash
crontab -e

# Add:
0 2 * * * docker exec postgres pg_dump -U openclaw_dba openclaw > /backups/steadyleads_$(date +\%Y\%m\%d).sql
```

---

## Support

For issues:
1. Check logs: `docker-compose logs api`
2. Check health: `curl http://localhost:3000/health`
3. Check database: `docker-compose exec postgres psql -U openclaw_dba openclaw`
4. Check Traefik: `docker logs traefik`

---

**Deployment Guide Complete**

Start date: 2026-03-22  
Last updated: 2026-03-22  
Status: Ready for production 🚀
