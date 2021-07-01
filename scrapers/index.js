const express = require("express");
const sheinScraper = require("./shein");
const asosScraper = require("./asos");
const previews = require("./previews");
const cors = require("cors");
const { signCache, getCached, getRecent } = require("./redis.js");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/filter", async (req, res) => {
  const { query } = req.body;
  let aborted = false;

  getCached(query).then((results) => {
    if (results) {
      aborted = true;
      res.json(results);
    }
  });

  const sheinList = sheinScraper(query);
  const asosList = asosScraper(query);

  const allResults = await Promise.all([asosList, sheinList])
    .then(shuffleResults)
    .catch(res.json);

  if (!aborted) {
    res.json(allResults);
    signCache(query, allResults);
  }
});

app.post("/api/preview", async (req, res) => {
  const { storeName, linkToBuy } = req.body.query;
  let aborted = false;

  await getCached({ linkToBuy }).then((results) => {
    if (results) {
      aborted = true;
      res.json(results);
    }
  });

  if (!aborted) {
    const preview = await previews[storeName](linkToBuy);
    res.json(preview);
    signCache({ linkToBuy }, preview);
  }
});

app.get("/api/recent", (req, res) => {
  getRecent().then((result) => res.json(result ? result : { e: "error" }));
});

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});

function shuffleResults(allResults) {
  const output = [];
  const longestLength = Math.max(...allResults.map((s) => s.length));
  for (let i = 0; i < longestLength; i++)
    for (let j = 0; j < allResults.length; j++) {
      if (allResults[j][i]) output.push(allResults[j][i]);
    }
  return output;
}

function translator(query) {
  switch (query.type) {
    case "Hoodies & Sweatshirts":
      query.type = "Sweatshirts";
      break;

    case "Lingerie & Nightwear":
      query.type = "Sexy Lingerie";
      break;

    case "Swimwear & Beachwear":
      query.type = "Beachwear";
      break;
  }
}

function colorTranslator(colors) {
  colors.forEach((color) => {
    if (sheinColors.include(color)) return color;
    else {
    }
  });
}
