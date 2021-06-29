const Redis = require("ioredis");
const { hash } = require("bcrypt");
const { HASH_SALT } = process.env;
const redis = new Redis({
  port: 6379, // Redis port
  host: "redis", // Redis host
  //   family: 4, // 4 (IPv4) or 6 (IPv6)
  //   password: "auth",
  db: 0,
});

async function signCache(query, results) {
  if (query.colors.length) {
    query.colors = query.colors.sort(); //alphabetic order-to avoid duplicates
  }
  if (query.sizes.length) {
    query.sizes = query.sizes.sort(); //alphabetic order-to avoid duplicates
  }
  hash(JSON.stringify(query), HASH_SALT, (err, hashed) => {
    redis.set(hashed, JSON.stringify(results));
  });
}

async function getCached(query) {
  const hashedQuery = await hash(JSON.stringify(query), HASH_SALT);
  return redis.get(hashedQuery).then(JSON.parse);
}
module.exports = { signCache, getCached };
