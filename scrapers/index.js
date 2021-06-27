const express = require("express");
const sheinScraper = require("./shein");
const asosScraper = require("./asos");

const app = express();

app.use(express.json());

app.get("/filter", async (req, res) => {
  const { query } = req.body;

  const sheinList = sheinScraper(query);
  const asosList = asosScraper(query);

  const allResults = await Promise.all([asosList, sheinList]).catch(res.json);

  res.json(shuffleResults(allResults));
});

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});

function shuffleResults(allResults) {
  const output = [];
  allResults
    .filter((v) => v)
    .forEach((store) => {
      console.log(store);
      store.filter((v) => v).forEach((item) => output.push(item));
    });
  return output;
}
