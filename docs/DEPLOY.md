# Deployment — Auto-deploy to a VPS with Docker Compose

Every push to `main` automatically deploys to the VPS via GitHub Actions
(`.github/workflows/deploy.yml`): the workflow SSHes into the server, pulls the
latest code, and rebuilds the containers with `docker compose up -d --build`.

## One-time server setup

1. **Install Docker + Compose plugin** on the VPS (Ubuntu example):
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

2. **Clone the repo** on the server:
   ```bash
   git clone https://github.com/omaralabaseery/e-commerce-tattoo-store.git /opt/tattoo-store
   cd /opt/tattoo-store
   ```

3. **Create the production `.env`** (never commit it):
   ```bash
   cp .env.example .env
   nano .env
   ```
   Fill in:
   - `POSTGRES_PASSWORD` — a strong DB password
   - `APP_JWT_SECRET` — generate with `openssl rand -base64 48`
   - `APP_CORS_ORIGINS` — your storefront URL(s), e.g. `https://yourdomain.com`
   - `NEXT_PUBLIC_API_URL` — the public backend URL, e.g. `https://api.yourdomain.com`

4. **First start:**
   ```bash
   docker compose up -d --build
   ```

5. **(Recommended) Reverse proxy + HTTPS** — put Nginx or Caddy in front:
   - `yourdomain.com` → `127.0.0.1:3000` (frontend)
   - `api.yourdomain.com` → `127.0.0.1:8080` (backend)

   Caddy example (`/etc/caddy/Caddyfile`) — automatic HTTPS:
   ```
   yourdomain.com {
       reverse_proxy 127.0.0.1:3000
   }
   api.yourdomain.com {
       reverse_proxy 127.0.0.1:8080
   }
   ```

## One-time GitHub setup

1. **Create a deploy SSH key** (on your machine or the server):
   ```bash
   ssh-keygen -t ed25519 -f deploy_key -N ""
   cat deploy_key.pub >> ~/.ssh/authorized_keys   # on the VPS, for the deploy user
   ```

2. **Add repository secrets** — GitHub → repo → *Settings → Secrets and variables → Actions*:

   | Secret        | Value                                        |
   |---------------|----------------------------------------------|
   | `VPS_HOST`    | Server IP or hostname                        |
   | `VPS_USER`    | SSH user (e.g. `root` or `deploy`)           |
   | `VPS_SSH_KEY` | Contents of the **private** key (`deploy_key`) |
   | `VPS_PORT`    | SSH port (optional, defaults to 22)          |
   | `VPS_APP_DIR` | Repo path on the server, e.g. `/opt/tattoo-store` |

3. Push to `main` (or run the workflow manually from the *Actions* tab) — done.

## Notes

- Product images uploaded from the admin panel are stored in the `tattoo_uploads`
  Docker volume (`/app/uploads` inside the backend container) and survive redeploys.
- The database lives in the `tattoo_pgdata` volume. Back it up with:
  ```bash
  docker exec tattoo_db pg_dump -U tattoo tattoo_store > backup_$(date +%F).sql
  ```
- Postgres is bound to `127.0.0.1` only — not reachable from the internet.
- `POSTGRES_PASSWORD` is applied only when the `tattoo_pgdata` volume is **first
  created**. If you change it later, either keep the old value, or reset the DB
  (`docker compose down -v` — deletes all data) or change it inside Postgres with
  `ALTER USER tattoo WITH PASSWORD '...'` before updating `.env`.
- The deploy workflow refuses to run if `.env` is missing on the server or still
  contains default `change-me` values.
- `NEXT_PUBLIC_API_URL` is baked into the frontend at **build** time; changing it
  requires a rebuild (`docker compose up -d --build frontend`).
