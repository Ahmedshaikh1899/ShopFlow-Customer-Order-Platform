const {loadConfig}=require("../src/config");
test("configuration loads defaults",()=>{const c=loadConfig({});expect(c.PORT).toBe(3000);expect(c.DB_HOST).toBe("localhost");});
test("invalid port is rejected",()=>expect(()=>loadConfig({PORT:"99999"})).toThrow("Invalid configuration"));
