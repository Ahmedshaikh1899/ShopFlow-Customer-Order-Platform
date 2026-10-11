
const pino = require("pino");
const request = require("supertest");
const { createApp } = require("../src/app");
const { createMetrics } = require("../src/metrics");

function appWith(
  poolQuery = jest.fn().mockResolvedValue({
    rows: [{ ok: 1 }],
    rowCount: 1
  })
) {
  const config = {
    NODE_ENV: "test",
    LOG_LEVEL: "silent",
    CORS_ORIGIN: "*",
    RATE_LIMIT_WINDOW_MS: 60000,
    RATE_LIMIT_MAX: 1000
  };

  const pool = { query: poolQuery };
  const logger = pino({ level: "silent" });

  return createApp({
    config,
    pool,
    logger,
    metrics: createMetrics()
  });
}

test("health endpoint reports healthy", async () => {
  const response = await request(appWith()).get("/health");

  expect(response.status).toBe(200);
  expect(response.body.status).toBe("ok");
  expect(response.headers["x-request-id"]).toBeTruthy();
});

test("readiness checks database", async () => {
  const response = await request(appWith()).get("/ready");

  expect(response.status).toBe(200);
  expect(response.body.status).toBe("ready");
});

test("readiness fails when database is unavailable", async () => {
  const poolQuery = jest.fn().mockRejectedValue(new Error("down"));
  const response = await request(appWith(poolQuery)).get("/ready");

  expect(response.status).toBe(503);
  expect(response.body.status).toBe("not_ready");
});

test("metrics endpoint returns Prometheus exposition", async () => {
  const response = await request(appWith()).get("/metrics");

  expect(response.status).toBe(200);
  expect(response.text).toContain("shopflow_");
});

test("unknown endpoint returns 404", async () => {
  const response = await request(appWith()).get("/not-found");

  expect(response.status).toBe(404);
  expect(response.body.error.code).toBe("NOT_FOUND");
});
