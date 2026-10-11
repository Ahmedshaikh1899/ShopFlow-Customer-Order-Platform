const {z}=require("zod");
const schema=z.object({
 NODE_ENV:z.enum(["development","test","production"]).default("development"),
 PORT:z.coerce.number().int().min(1).max(65535).default(3000),
 LOG_LEVEL:z.string().default("info"), CORS_ORIGIN:z.string().default("*"),
 RATE_LIMIT_WINDOW_MS:z.coerce.number().positive().default(60000),
 RATE_LIMIT_MAX:z.coerce.number().positive().default(120),
 DB_HOST:z.string().default("localhost"), DB_PORT:z.coerce.number().int().min(1).max(65535).default(5432),
 DB_NAME:z.string().default("shopflow"), DB_USER:z.string().default("shopflow"),
 DB_PASSWORD:z.string().min(1).default("change-me"), DB_POOL_MAX:z.coerce.number().int().min(1).max(100).default(10)
});
function loadConfig(env=process.env){const p=schema.safeParse(env);if(!p.success)throw new Error("Invalid configuration: "+p.error.issues.map(i=>`${i.path.join(".")}: ${i.message}`).join("; "));return p.data;}
module.exports={loadConfig};
