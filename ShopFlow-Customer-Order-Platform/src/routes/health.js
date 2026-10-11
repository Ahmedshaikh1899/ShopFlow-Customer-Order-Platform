
const express = require("express");

function healthRouter({ pool, startedAt }) {
  const r = express.Router();

  r.get("/health", (_q, s) =>
    s.json({
      status: "ok",
      service: "shopflow-api",
      uptimeSeconds: Math.floor(process.uptime()),
      startedAt: new Date(startedAt).toISOString()
    })
  );

  r.get("/ready", async (_q, s) => {
    try {
      await pool.query("SELECT 1");

      s.json({
        status: "ready",
        checks: {
          database: "ok"
        }
      });
    } catch {
      s.status(503).json({
        status: "not_ready",
        checks: {
          database: "failed"
        }
      });
    }
  });

  return r;
}

module.exports = { healthRouter };
