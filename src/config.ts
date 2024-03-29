import dotenv from "dotenv";

dotenv.config();
const config: {
  port: string;
  apiRoot: false | string;
  jwt: {
    secret: string;
  };
  wp: {
    logged_in_key: string;
    logged_in_salt: string;
  };
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  CROWD_URL: string;
  ssl?: {
    chain: string;
    private: string;
  };
} = {
  port: process.env.PORT || "3000",
  apiRoot: false,
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
  wp: {
    logged_in_key: process.env.WP_LOGGED_IN_KEY || "",
    logged_in_salt: process.env.WP_LOGGED_IN_SALT || "",
  },
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "tryber",
  },
  CROWD_URL: process.env.CROWD_URL || "https://app.tryber.me/",
};

if (process.env.API_ROOT) {
  config.apiRoot = process.env.API_ROOT || false;
}

export default config;
