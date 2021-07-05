const puppeteer = require("puppeteer");

async function terminalxPreview(linkToBuy) {
  const headless = process.env.headless || false;
  const browser = await puppeteer.launch({
    headless,
    defaultViewport: { width: 3000, height: 2000 },
  });
  const page = await browser.newPage();
  await page.goto(linkToBuy);

  const item = { storeName: "TerminalX", linkToBuy };

  await page.waitForSelector(".slick-slide.slick-active.slick-current");
  const imgContainer = await page.$(".image-container_272l");
  item.imgSrc = await imgContainer
    .$("img.image_3k9y")
    .then((imgElem) => imgElem.getProperty("src"))
    .then((handle) => handle.jsonValue());

  item.title = await page
    .$("h1.name_20R6")
    .then((elem) => elem.getProperty("innerText"))
    .then((handle) => handle.jsonValue());

  const priceDiv = await page.$(".prices_3bzP");

  item.prevPrice = await priceDiv
    .$(".prices-regular_yum0")
    .then(async (div) => {
      if (!div) return null;
      const priceWithShach = await div
        .getProperty("innerText")
        .then((handle) => handle.jsonValue());

      return Number(priceWithShach.replace("₪", ""));
    });

  item.price = await priceDiv
    .$(".prices-final_1R9x")
    .then((elem) => elem.getProperty("innerText"))
    .then(async (handle) => {
      const priceWithShach = await handle.jsonValue();
      return Number(priceWithShach.replace("₪", ""));
    });

  item.discountPercent =
    item.prevPrice && 100 * (1 - item.price / item.prevPrice);

  browser.close();
  return item;
}
module.exports = terminalxPreview;
