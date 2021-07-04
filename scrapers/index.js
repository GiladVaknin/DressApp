const express = require("express");
const sheinScraper = require("./scrapers/shein");
const asosScraper = require("./scrapers/asos");
const scrapers = require("./scrapers");
const previews = require("./previews");
const cors = require("cors");
const { signCache, getCached, getRecent } = require("./redis.js");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/filter", async (req, res) => {
  const { query } = req.body;

  const cached = await getCached(query, "items");
  if (cached) return res.json(cached);

  // const sheinList = sheinScraper(query);
  // const asosList = asosScraper(query);

  const scrapingPromises = scrapers.map((scraper) => scraper(query));
  const allResults = await Promise.all(scrapingPromises)
    .then(shuffleResults)
    .catch((e) => console.log(e));

  res.json(allResults);
  signCache(query, allResults, "items");
});

app.post("/api/preview", async (req, res) => {
  const { storeName, linkToBuy } = req.body.query;
  const cached = await getCached(req.body.query, "previews");
  if (cached) return res.json(cached);

  const preview = await previews[storeName](linkToBuy);
  res.json(preview);
  signCache(req.body.query, preview, "previews");
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
