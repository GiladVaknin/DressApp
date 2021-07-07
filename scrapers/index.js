const express = require("express");
const cors = require("cors");
const app = express();
const puppeteer = require("puppeteer");

const scrapers = require("./scrapers");
const previews = require("./previews");
const { signCache, getCached, getRecent } = require("./redis.js");

app.use(express.json());
app.use(cors());

app.post("/api/filter", async (req, res) => {
  const { query } = req.body;

  const cached = await getCached(query, "items");
  if (cached) return res.json(cached);

  const scrapingPromises = scrapers.map(async (scraper) => scraper(query));

  const allResults = await Promise.allSettled(scrapingPromises)
    .then(flatAllSettled)
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

app.post("/api/cachepreviews", async (req, res) => {
  const { query } = req.body;

  const { headless = false } = process.env;
  const browser = await puppeteer.launch({ headless });
  try {
    for (const item of query) {
      const cached = await getCached(item, "previews");
      if (cached) continue;

      const preview = await previews[item.storeName](item.linkToBuy, browser);
      signCache(item, preview, "previews");
    }

    browser.close();
    res.send("OK");
  } catch (e) {
    browser.close();
    res.send(e);
  }
  // Promise.allSettled(promises).then(() => res.send("OK"));
});

app.get("/api/recent", (req, res) => {
  getRecent()
    .then((result) => res.json(result ? result : { e: "No Cache" }))
    .catch((e) => res.json({ e }));
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

function flatAllSettled(promArr) {
  return promArr
    .map((promise) => {
      if (promise.status === "fulfilled") {
        return promise.value;
      } else {
        return null;
      }
    })
    .filter((val) => val);
}
