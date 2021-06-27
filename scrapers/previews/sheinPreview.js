const puppeteer = require("puppeteer");

async function sheinPreview(linkToBuy) {
  const headless = process.env.headless || false;
  const browser = await puppeteer.launch({
    headless,
    defaultViewport: { width: 3000, height: 2000 },
  });
  const page = await browser.newPage();
  await page.goto(linkToBuy);

  const item = { storeName: "Shein", linkToBuy };

  await page.waitForSelector("img.j-verlok-lazy.loaded");
  item.imgSrc = await page
    .$("img.j-verlok-lazy.loaded")
    .then((imgElem) => imgElem.getProperty("src"))
    .then((handle) => handle.jsonValue());

  item.title = await page
    .$(".product-intro__head-name")
    .then((elem) => elem.getProperty("innerText"))
    .then((handle) => handle.jsonValue());

  const priceDiv = await page.$(".product-intro__head-price");

  item.price = await priceDiv
    .$("span")
    .then((elem) => elem.getProperty("innerText"))
    .then(async (handle) => {
      const priceWithShach = await handle.jsonValue();
      return Number(priceWithShach.replace("₪", ""));
    });

  item.prevPrice = await priceDiv.$(".del-price").then(async (div) => {
    if (!div) return null;
    const priceWithShach = await div
      .getProperty("innerText")
      .then((handle) => handle.jsonValue());

    return Number(priceWithShach.replace("₪", ""));
  });

  item.discountPercent = await priceDiv
    .$(".discount-label")
    .then(async (div) => {
      if (!div) return null;
      const discountWithSymbols = await div
        .getProperty("innerText")
        .then((handle) => handle.jsonValue());
      return Number(discountWithSymbols.replace("-", "").replace("%", ""));
    });

  item.rank = await page
    .$(".ave-rate")
    .then((elem) => elem.getProperty("innerText"))
    .then(async (handle) => Number(await handle.jsonValue()));

  browser.close();
  return item;
}
module.exports = sheinPreview;
