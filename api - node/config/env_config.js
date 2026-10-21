import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const envPath = path.join(__dirname, "../.env");
dotenv.config({ path: envPath });

const { URL,PORT,DATABASE_URL,SECRET_TOKEN_JWT} = process.env;


export { URL,PORT,DATABASE_URL,SECRET_TOKEN_JWT};

