import http from 'node:http'
import handler from 'serve-handler'

// Use the injected PORT if present, otherwise default to 8080 — Railway's
// generated domains route to 8080 by default, so listening there means the
// public URL works with zero manual port configuration.
const port = Number(process.env.PORT) || 8080

const server = http.createServer((req, res) =>
  handler(req, res, {
    public: 'dist',
    // SPA fallback: any unmatched path serves index.html (existing files
    // — assets, etc. — are served directly first).
    rewrites: [{ source: '**', destination: '/index.html' }],
  }),
)

// IMPORTANT: listen with no host so Node binds dual-stack (::), which accepts
// both IPv6 and IPv4. Railway's health checks and internal routing use IPv6;
// binding to IPv4-only (0.0.0.0) makes the health check fail and the service
// never gets a public domain.
server.listen(port, () => {
  console.log(`▶ Serving dist/ on port ${port} (dual-stack)`)
})
