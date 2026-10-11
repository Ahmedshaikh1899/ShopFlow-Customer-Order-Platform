const request=require("supertest"),{createApp}=require("../src/app"),{createMetrics}=require("../src/metrics");
function appWith(poolQuery=jest.fn().mockResolvedValue({rows:[{ok:1}],rowCount:1})){const config={NODE_ENV:"test",LOG_LEVEL:"silent",CORS_ORIGIN:"*",RATE_LIMIT_WINDOW_MS:60000,RATE_LIMIT_MAX:1000};const pool={query:poolQuery};const logger={info:jest.fn(),warn:jest.fn(),error:jest.fn()};return createApp({config,pool,logger,metrics:createMetrics()});}
test("health endpoint reports healthy",async()=>{const r=await request(appWith()).get("/health");expect(r.status).toBe(200);expect(r.body.status).toBe("ok");expect(r.headers["x-request-id"]).toBeTruthy();});
test("readiness checks database",async()=>{const r=await request(appWith()).get("/ready");expect(r.status).toBe(200);});
test("readiness fails when database is unavailable",async()=>{const r=await request(appWith(jest.fn().mockRejectedValue(new Error("down")))).get("/ready");expect(r.status).toBe(503);});
test("metrics endpoint returns Prometheus exposition",async()=>{const r=await request(appWith()).get("/metrics");expect(r.status).toBe(200);expect(r.text).toContain("shopflow_");});
test("unknown endpoint returns 404",async()=>{const r=await request(appWith()).get("/not-found");expect(r.status).toBe(404);expect(r.body.error.code).toBe("NOT_FOUND");});
