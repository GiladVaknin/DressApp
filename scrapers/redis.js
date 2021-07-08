const Redis = require("ioredis");
const { hash } = require("bcrypt");
const { HASH_SALT, REDIS_HOST } = process.env;
const redis = {};

redis.items = new Redis({
  port: 6379,
  host: REDIS_HOST || "localhost",
  password: "123456789",
  db: 0,
});
redis.previews = new Redis({
  port: 6379,
  host: REDIS_HOST || "localhost",
  password: "123456789",
  db: 1,
});

async function signCache(query, results, db) {
  if (db === "items" && !results.length) return; // if there are no results, dont save
  if (query.colors?.length) query.colors = query.colors.sort(); //alphabetic order-to avoid duplicates
  if (query.sizes?.length) query.sizes = query.sizes.sort(); //alphabetic order-to avoid duplicates

  hash(stringify(query), HASH_SALT, (err, hashed) => {
    redis[db].set(hashed, JSON.stringify(results), "EX", 43200); //12 hours
  });
}

async function getCached(query, db) {
  if (query.colors?.length) query.colors = query.colors.sort(); //alphabetic order-to avoid duplicates
  if (query.sizes?.length) query.sizes = query.sizes.sort(); //alphabetic order-to avoid duplicates

  const hashedQuery = await hash(stringify(query), HASH_SALT);
  return redis[db].get(hashedQuery).then(JSON.parse);
}

async function getRecent(limit) {
  const [cursor, keys] = await redis.items.scan(0);

  const allResults = await Promise.all(keys.map((key) => redis.items.get(key)));

  const output = allResults
    .slice(0, 5)
    .map((jsonArr) => JSON.parse(jsonArr).slice(0, 6))
    .flat();

  return output;
}
module.exports = { signCache, getCached, getRecent };

function stringify(query) {
  let string = "";
  for (prop in query) {
    if (!query[prop]) continue;
    if (typeof query[prop] === "string") string += query[prop];
    else {
      query[prop].forEach((val) => (string += val));
    }
  }
  return string;
}
