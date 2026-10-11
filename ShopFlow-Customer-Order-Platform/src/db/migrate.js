require("dotenv").config();
const fs=require("node:fs"),path=require("node:path");
const {loadConfig}=require("../config"),{createPool}=require("./pool");
async function main(){const pool=createPool(loadConfig());try{await pool.query(fs.readFileSync(path.join(__dirname,"schema.sql"),"utf8"));process.stdout.write("Database schema is ready.\\n");}finally{await pool.end();}}
main().catch(e=>{process.stderr.write(`Migration failed: ${e.message}\\n`);process.exitCode=1;});
