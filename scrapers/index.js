const express = require("express");
const sheinScraper = require("./shein");
const asosScraper = require("./asos");
const previews = require("./previews");

const app = express();

app.use(express.json());

app.get("/api/filter", async (req, res) => {
  const { query } = req.body;

  const sheinList = sheinScraper(query);
  const asosList = asosScraper(query);

  const allResults = await Promise.all([asosList, sheinList]).catch(res.json);

  res.json(shuffleResults(allResults));
});

app.get("/api/preview", async (req, res) => {
  const { storeName, linkToBuy } = req.body.query;
  const preview = await previews[storeName](linkToBuy);
  res.json(preview);
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
