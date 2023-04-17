import config from "../config";

import clickdayDb from "@appquality/clickday-database";
import tryberDb from "@appquality/tryber-database";
import dotenv from "dotenv";

dotenv.config();

export const tryber = tryberDb({
  client: "mysql",
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  },
  pool: { min: 1, max: 7 },
});

export const clickDay = clickdayDb({
  client: "mysql",
  connection: {
    host: process.env.CLICKDAY_DB_HOST,
    user: process.env.CLICKDAY_DB_USER,
    password: process.env.CLICKDAY_DB_PASSWORD,
    database: process.env.CLICKDAY_DB_DATABASE,
  },
  pool: { min: 1, max: 7 },
});
