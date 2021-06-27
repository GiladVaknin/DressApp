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

  console.log(asosList);
  const mainResult = [];
  allResults.forEach((val) =>
    val.status === "fulfilled" ? mainResult.push(...val.value) : null
  );

  res.json(allResults);
});

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
