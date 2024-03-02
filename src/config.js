import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3001;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_DATABASE = process.env.DB_DATABASE || 'siveth';
export const DB_PORT = process.env.DB_PORT || 3306;


// export const PORT = process.env.PORT || 3000;
// export const DB_HOST = process.env.DB_HOST || 'uk-fast-web1216.main-hosting.eu';
// export const DB_USER = process.env.DB_USER || 'u233332198_BD_Siveth';
// export const DB_PASSWORD = process.env.DB_PASSWORD || 'Siveth28032003*';
// export const DB_DATABASE = process.env.DB_DATABASE || 'u233332198_BD_Siveth';
// export const DB_PORT = process.env.DB_PORT || 3306;
