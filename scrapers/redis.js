const Redis = require("ioredis");
const { hash } = require("bcrypt");
const { HASH_SALT } = process.env;

const redis = new Redis({
  port: 6379,
  host: "redis",
  password: "123456789",
  db: 0,
});

async function signCache(query, results) {
  if (query.colors?.length) {
    query.colors = query.colors.sort(); //alphabetic order-to avoid duplicates
  }
  if (query.sizes?.length) {
    query.sizes = query.sizes.sort(); //alphabetic order-to avoid duplicates
  }
  hash(JSON.stringify(query), HASH_SALT, (err, hashed) => {
    redis.set(hashed, JSON.stringify(results), "EX", 43200); //12 hours
  });
}

async function getCached(query) {
  if (query.colors?.length) {
    query.colors = query.colors.sort(); //alphabetic order-to avoid duplicates
  }
  if (query.sizes?.length) {
    query.sizes = query.sizes.sort(); //alphabetic order-to avoid duplicates
  }
  const hashedQuery = await hash(JSON.stringify(query), HASH_SALT);
  return redis.get(hashedQuery).then(JSON.parse);
}
module.exports = { signCache, getCached };

async function getRecent(limit) {
  redis.scan();
}
