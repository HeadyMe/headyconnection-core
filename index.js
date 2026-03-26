/*
 * © 2026 Heady Systems LLC.
 * HeadyConnection — Standalone Server
 * Projected from the Heady Latent OS
 */
const express = require('express');
const siteConfig = require('./site-config.json');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';
const BASE_URL = process.env.BASE_URL || 'https://headyconnection.org';

// ---------------------------------------------------------------------------
// Structured logging helper
// ---------------------------------------------------------------------------
function log(level, message, meta = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    service: 'HeadyConnection',
    message,
    ...meta,
  };
  if (NODE_ENV === 'production') {
    process.stdout.write(JSON.stringify(entry) + '\n');
  } else {
    process.stdout.write(`[${entry.ts}] ${level.toUpperCase()} ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`);
  }
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json({ limit: '1mb' }));

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  next();
});

// CORS — driven by environment, not hardcoded wildcards
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [BASE_URL];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Request logging
app.use((req, _res, next) => {
  log('info', `${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// ---------------------------------------------------------------------------
// Heady ecosystem cross-links
// ---------------------------------------------------------------------------
const HEADY_SERVICES = [
  { name: 'HeadyMe', url: 'https://headyme.org', desc: 'Personal AI Workspace' },
  { name: 'HeadySystems', url: 'https://headysystems.com', desc: 'Core Platform & Orchestration' },
  { name: 'HeadyOS', url: 'https://headyos.org', desc: 'Latent Operating System' },
  { name: 'HeadyAPI', url: 'https://headyapi.org', desc: 'API Gateway & Services' },
  { name: 'HeadyIO', url: 'https://headyio.org', desc: 'Input/Output & Integration Layer' },
  { name: 'HeadyMCP', url: 'https://headymcp.org', desc: 'Model Context Protocol' },
  { name: 'HeadyBuddy', url: 'https://headybuddy.org', desc: 'AI Companion & Device Bridge' },
  { name: 'HeadyBot', url: 'https://headybot.org', desc: 'Bot Framework & Automation' },
  { name: 'Heady Docs', url: 'https://docs.headysystems.com', desc: 'Documentation Hub' },
];

// ---------------------------------------------------------------------------
// Shared HTML helpers
// ---------------------------------------------------------------------------
function htmlHead(title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — HeadyConnection</title>
  <meta name="description" content="${siteConfig.description}">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #0f0a1a; color: #e2e0eb; line-height: 1.6; }
    a { color: ${siteConfig.accent}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .container { max-width: 960px; margin: 0 auto; padding: 0 1.5rem; }
    nav { background: #1a1128; border-bottom: 1px solid #2d2245; padding: 1rem 0; }
    nav .container { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
    nav .brand { font-weight: 700; font-size: 1.25rem; color: #fff; }
    nav .links { display: flex; gap: 1.25rem; flex-wrap: wrap; }
    nav .links a { color: #c4b5fd; font-size: 0.9rem; }
    nav .links a:hover { color: #fff; }
    .hero { text-align: center; padding: 4rem 1rem 3rem; }
    .hero h1 { font-size: 2.5rem; color: #fff; margin-bottom: 0.75rem; }
    .hero p { font-size: 1.15rem; color: #a89ec8; max-width: 600px; margin: 0 auto; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; padding: 2rem 0 3rem; }
    .feature { background: #1a1128; border: 1px solid #2d2245; border-radius: 12px; padding: 1.5rem; text-align: center; }
    .feature .icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .feature h3 { color: #fff; margin-bottom: 0.25rem; }
    .feature p { font-size: 0.9rem; color: #a89ec8; }
    .services { padding: 2rem 0 3rem; }
    .services h2 { text-align: center; color: #fff; margin-bottom: 1.5rem; }
    .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .service-card { background: #1a1128; border: 1px solid #2d2245; border-radius: 8px; padding: 1rem 1.25rem; }
    .service-card h4 { color: ${siteConfig.accent}; margin-bottom: 0.25rem; }
    .service-card p { font-size: 0.85rem; color: #a89ec8; }
    footer { border-top: 1px solid #2d2245; padding: 2rem 0; text-align: center; color: #6b6280; font-size: 0.85rem; }
    .btn { display: inline-block; padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 600; transition: opacity 0.2s; }
    .btn-primary { background: ${siteConfig.accent}; color: #0f0a1a; }
    .btn-primary:hover { opacity: 0.85; text-decoration: none; }
    .btn-outline { border: 1px solid ${siteConfig.accent}; color: ${siteConfig.accent}; }
    .btn-outline:hover { background: ${siteConfig.accent}22; text-decoration: none; }
    .btn-group { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap; }
    .doc-section { padding: 2rem 0; }
    .doc-section h2 { color: #fff; margin-bottom: 1rem; border-bottom: 1px solid #2d2245; padding-bottom: 0.5rem; }
    .doc-section h3 { color: #c4b5fd; margin: 1.25rem 0 0.5rem; }
    .doc-section ul { padding-left: 1.25rem; margin-bottom: 1rem; }
    .doc-section li { margin-bottom: 0.35rem; }
    .doc-section code { background: #1a1128; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
    .doc-section pre { background: #1a1128; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0.75rem 0; }
    .doc-section pre code { background: none; padding: 0; }
  </style>
</head>
<body>`;
}

function htmlNav() {
  return `<nav>
  <div class="container">
    <a href="/" class="brand">HeadyConnection</a>
    <div class="links">
      <a href="/">Home</a>
      <a href="/docs">Docs</a>
      <a href="/services">Services</a>
      <a href="/health">Health</a>
      <a href="https://docs.headysystems.com" target="_blank" rel="noopener">Heady Docs</a>
      <a href="https://github.com/HeadyMe/headyconnection-core" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>
</nav>`;
}

function htmlFooter() {
  return `<footer>
  <div class="container">
    <p>&copy; 2026 Heady Systems LLC. Built with Sacred Geometry &middot; Powered by the Heady Latent OS</p>
    <p style="margin-top:0.5rem">
      <a href="/docs">Documentation</a> &middot;
      <a href="/services">Ecosystem</a> &middot;
      <a href="/health">Health Check</a> &middot;
      <a href="https://github.com/HeadyMe" target="_blank" rel="noopener">GitHub</a>
    </p>
  </div>
</footer>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health endpoint
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'HeadyConnection',
    domain: 'headyconnection.org',
    version: require('./package.json').version,
    environment: NODE_ENV,
    projected: true,
    ts: new Date().toISOString(),
  });
});

// Landing page
app.get('/', (_req, res) => {
  const featuresHTML = siteConfig.features
    .map(
      (f) =>
        `<div class="feature"><div class="icon">${f.icon}</div><h3>${f.title}</h3><p>${f.desc}</p></div>`
    )
    .join('\n');

  const servicesHTML = HEADY_SERVICES.map(
    (s) =>
      `<div class="service-card"><h4><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></h4><p>${s.desc}</p></div>`
  ).join('\n');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`${htmlHead('Home')}
${htmlNav()}
<main>
  <section class="hero">
    <div class="container">
      <h1>${siteConfig.name}</h1>
      <p>${siteConfig.description}</p>
      <div class="btn-group">
        <a href="/docs" class="btn btn-primary">Get Started</a>
        <a href="/services" class="btn btn-outline">Explore Ecosystem</a>
      </div>
    </div>
  </section>

  <section class="container">
    <div class="features">
      ${featuresHTML}
    </div>
  </section>

  <section class="services container">
    <h2>Heady Ecosystem</h2>
    <div class="service-grid">
      ${servicesHTML}
    </div>
  </section>
</main>
${htmlFooter()}`);
});

// Documentation page
app.get('/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`${htmlHead('Documentation')}
${htmlNav()}
<main class="container doc-section">
  <h2>HeadyConnection Documentation</h2>
  <p>HeadyConnection is the community and collaboration layer of the Heady Latent OS ecosystem.</p>

  <h3>Quick Start</h3>
  <pre><code>git clone https://github.com/HeadyMe/headyconnection-core.git
cd headyconnection-core
npm install
npm start</code></pre>

  <h3>Configuration</h3>
  <p>HeadyConnection reads configuration from environment variables:</p>
  <ul>
    <li><code>PORT</code> — Server port (default: <code>8080</code>)</li>
    <li><code>NODE_ENV</code> — Environment: <code>production</code> or <code>development</code></li>
    <li><code>BASE_URL</code> — Public base URL (default: <code>https://headyconnection.org</code>)</li>
    <li><code>ALLOWED_ORIGINS</code> — Comma-separated CORS origins</li>
  </ul>

  <h3>Architecture</h3>
  <p>HeadyConnection is a lightweight Express service that serves the community landing page, documentation, and ecosystem navigation. It is designed to be deployed as a standalone container on Google Cloud Run.</p>
  <ul>
    <li><strong>Runtime:</strong> Node.js 20+ with Express</li>
    <li><strong>Deployment:</strong> Docker container on Cloud Run</li>
    <li><strong>Configuration:</strong> Environment variables + <code>site-config.json</code></li>
    <li><strong>Health check:</strong> <code>GET /health</code> returns JSON status</li>
  </ul>

  <h3>API Routes</h3>
  <ul>
    <li><code>GET /</code> — Landing page with features and ecosystem links</li>
    <li><code>GET /docs</code> — This documentation page</li>
    <li><code>GET /services</code> — Heady ecosystem service directory</li>
    <li><code>GET /health</code> — Health check endpoint (JSON)</li>
  </ul>

  <h3>Deployment</h3>
  <pre><code># Build and run locally
docker build -t headyconnection .
docker run -p 8080:8080 -e NODE_ENV=production headyconnection

# The GitHub Actions workflow deploys automatically on push to main</code></pre>

  <h3>Ecosystem Links</h3>
  <ul>
    ${HEADY_SERVICES.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a> — ${s.desc}</li>`).join('\n    ')}
  </ul>

  <h3>Troubleshooting</h3>
  <ul>
    <li><strong>Port conflict:</strong> Set <code>PORT</code> env var to a different port</li>
    <li><strong>CORS errors:</strong> Set <code>ALLOWED_ORIGINS</code> to include your client origin</li>
    <li><strong>Health check fails:</strong> Ensure the server started — check logs for startup message</li>
  </ul>
</main>
${htmlFooter()}`);
});

// Services directory page
app.get('/services', (_req, res) => {
  const servicesHTML = HEADY_SERVICES.map(
    (s) =>
      `<div class="service-card"><h4><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></h4><p>${s.desc}</p></div>`
  ).join('\n');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`${htmlHead('Ecosystem Services')}
${htmlNav()}
<main class="container">
  <section class="services" style="padding-top:2.5rem">
    <h2>Heady Ecosystem Services</h2>
    <p style="text-align:center;color:#a89ec8;margin-bottom:1.5rem">The complete Heady Latent OS service mesh</p>
    <div class="service-grid">
      ${servicesHTML}
    </div>
  </section>
</main>
${htmlFooter()}`);
});

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`${htmlHead('Page Not Found')}
${htmlNav()}
<main class="container" style="text-align:center;padding:4rem 1rem">
  <h1 style="color:#fff;font-size:3rem;margin-bottom:1rem">404</h1>
  <p style="color:#a89ec8;font-size:1.15rem;margin-bottom:2rem">The page you're looking for doesn't exist.</p>
  <a href="/" class="btn btn-primary">Back to Home</a>
</main>
${htmlFooter()}`);
});

// ---------------------------------------------------------------------------
// Server startup
// ---------------------------------------------------------------------------
const server = app.listen(PORT, () => {
  log('info', 'HeadyConnection started', { port: PORT, env: NODE_ENV, base: BASE_URL });
});

// Graceful shutdown
function shutdown(signal) {
  log('info', `Received ${signal}, shutting down gracefully`);
  server.close(() => {
    log('info', 'Server closed');
    process.exit(0);
  });
  // Force exit after 10 seconds
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
