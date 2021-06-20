const express = require("express");
const sheinScraper = require("./shein");

const app = express();

app.use(express.json());

app.get("/filter", async (req, res) => {
  const { query } = req.body;
  const sheinList = await sheinScraper(query);
  res.json(sheinList);
});
app.listen(80);
