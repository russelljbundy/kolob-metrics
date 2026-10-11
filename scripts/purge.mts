// Null out comment text older than 30 days (YouTube API Services policy).
// The collector also runs this at startup; schedule it daily once deployed.
//
//   npm run purge

import { openDb, purgeExpiredText } from "../lib/db";

const db = openDb();
const n = purgeExpiredText(db);
console.log(`Purged text from ${n} comments.`);
db.close();
