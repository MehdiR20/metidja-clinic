// Starts a real PostgreSQL server from node_modules — for dev machines without Docker.
// Usage: npm run db:local   (keep it running, then `npm run db:push && npm run db:seed`)
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import path from "node:path";

const databaseDir = path.resolve(".pgdata");
const pg = new EmbeddedPostgres({
  databaseDir,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
  // UTF-8 is required for Arabic content (Windows otherwise defaults to WIN1252)
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
});

const fresh = !existsSync(databaseDir);
if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase("metidja");

console.log("PostgreSQL ready on postgresql://postgres:postgres@localhost:5432/metidja");

const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
