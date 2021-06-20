const express = require("express");
const sheinScraper = require("./shein");
const asosScraper = require("./asos");

const app = express();

app.use(express.json());

app.get("/filter", async (req, res) => {
  const { query } = req.body;

  const sheinList = sheinScraper(query);
  const asosList = asosScraper(query);
  Promise.all([asosList, sheinList]).then((lists) => res.json(lists));
});

app.listen(80);
