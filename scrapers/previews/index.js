const Shein = require("./sheinPreview");
const Asos = require("./asosPreview");
const TerminalX = require("./terminalxPreview");

const puppeteer = require("puppeteer");
const { headless = false } = process.env;
const previewsBrowser = puppeteer.launch({
  headless,
  // slowMo: 50,
  defaultViewport: { width: 1600, height: 1000 },
});

module.exports = { Shein, Asos, TerminalX, previewsBrowser };
