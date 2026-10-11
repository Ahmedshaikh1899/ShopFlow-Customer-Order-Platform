const {Pool}=require("pg");
function createPool(c){return new Pool({host:c.DB_HOST,port:c.DB_PORT,database:c.DB_NAME,user:c.DB_USER,password:c.DB_PASSWORD,max:c.DB_POOL_MAX,idleTimeoutMillis:30000,connectionTimeoutMillis:3000,application_name:"shopflow-api"});}
module.exports={createPool};
