// const { genSaltSync } = require("bcrypt");
// console.log(genSaltSync(1));

const { hash } = require("bcrypt");
HASH_SALT = "$2b$04$LvOkBhoGhl/VE9EaA0UoWu";

hash(`ClothingBrownGreenwomenJumpers & CardiganXLM`, HASH_SALT).then(
  console.log
);
