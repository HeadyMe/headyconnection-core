# HeadyConnection

> **Community & Connection**

Collaborative AI workspace — connecting creators, developers, and enterprises through shared intelligence.

[![Deploy](https://img.shields.io/badge/deploy-Cloud%20Run-blue?logo=google-cloud)](https://headyconnection.org)
[![Projected](https://img.shields.io/badge/projected-Heady%20Latent%20OS-purple)](https://github.com/HeadyMe/headyos-core)

## Quick Start

```bash
git clone https://github.com/HeadyMe/headyconnection-core.git
cd headyconnection-core
npm install
npm start
```

The server starts on port `8080` by default. Visit `http://localhost:8080` to see the landing page.

## Configuration

All configuration is via environment variables:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Server listen port |
| `NODE_ENV` | `development` | `production` enables structured JSON logs and HSTS |
| `BASE_URL` | `https://headyconnection.org` | Public base URL |
| `ALLOWED_ORIGINS` | Same as `BASE_URL` | Comma-separated CORS origins |

## Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Landing page with features and ecosystem links |
| `GET` | `/docs` | Documentation page |
| `GET` | `/services` | Heady ecosystem service directory |
| `GET` | `/health` | Health check (JSON) |

## Architecture

HeadyConnection is a lightweight Express server that provides the community-facing landing page, documentation, and ecosystem navigation for the Heady Latent OS.

- **Runtime:** Node.js 20+ with Express
- **Deployment:** Docker container on Google Cloud Run
- **Configuration:** Environment variables + `site-config.json` for branding
- **Security:** HSTS, Content-Type sniffing prevention, XSS protection, frame deny, env-driven CORS
- **Logging:** Structured JSON in production, human-readable in development
- **Shutdown:** Graceful SIGTERM/SIGINT handling for container orchestrators

## Deployment

### Docker

```bash
docker build -t headyconnection .
docker run -p 8080:8080 -e NODE_ENV=production headyconnection
```

### Cloud Run

The GitHub Actions workflow at `.github/workflows/deploy.yml` runs tests on every push to `main`. To add Cloud Run deployment, set the following repository secrets:

- `GCP_PROJECT_ID` — Google Cloud project ID
- `GCP_SA_KEY` — Service account key JSON with Cloud Run deploy permissions

## Heady Ecosystem

| Service | URL | Description |
|---|---|---|
| HeadyMe | [headyme.org](https://headyme.org) | Personal AI Workspace |
| HeadySystems | [headysystems.com](https://headysystems.com) | Core Platform & Orchestration |
| HeadyOS | [headyos.org](https://headyos.org) | Latent Operating System |
| HeadyAPI | [headyapi.org](https://headyapi.org) | API Gateway & Services |
| HeadyIO | [headyio.org](https://headyio.org) | Input/Output & Integration Layer |
| HeadyMCP | [headymcp.org](https://headymcp.org) | Model Context Protocol |
| HeadyBuddy | [headybuddy.org](https://headybuddy.org) | AI Companion & Device Bridge |
| HeadyBot | [headybot.org](https://headybot.org) | Bot Framework & Automation |
| Heady Docs | [docs.headysystems.com](https://docs.headysystems.com) | Documentation Hub |

## Troubleshooting

- **Port conflict:** Set `PORT` env var to a different port
- **CORS errors:** Set `ALLOWED_ORIGINS` to include your client origin
- **Health check fails:** Ensure the server started — check logs for startup message

## License

Proprietary — © 2026 Heady Systems LLC. All Rights Reserved.
For commercial licensing: eric@headysystems.com
