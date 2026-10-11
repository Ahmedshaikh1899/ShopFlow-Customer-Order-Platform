const pino=require("pino");
function createLogger(config){return pino({level:config.LOG_LEVEL,base:{service:"shopflow-api",environment:config.NODE_ENV},redact:{paths:["req.headers.authorization","req.headers.cookie","password","*.password"],censor:"[REDACTED]"},timestamp:pino.stdTimeFunctions.isoTime});}
module.exports={createLogger};
