import clickdayDb from "@appquality/clickday-database";
import tryberDb from "@appquality/tryber-database";

export const tryber = tryberDb({
  client: "better-sqlite3",
  connection: {
    filename: ":memory:",
  },
  useNullAsDefault: true,
});

export const clickDay = clickdayDb({
  client: "better-sqlite3",
  connection: {
    filename: ":memory:",
  },
  useNullAsDefault: true,
});
