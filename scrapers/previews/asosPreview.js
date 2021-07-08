const puppeteer = require("puppeteer");

async function getPreview(linkToBuy, openBrowser) {
  const headless = process.env.headless || false;
  const browser =
    openBrowser ||
    (await puppeteer.launch({
      headless,
      defaultViewport: { width: 770, height: 1024 },
      timeout: 500000,
    }));

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.goto(linkToBuy);
    await page.waitForSelector("div.product-hero h1");

    const item = { storeName: "Asos", linkToBuy };

    item.title = await page
      .$("div.product-hero h1")
      .then((elem) => elem.getProperty("innerText"))
      .then((handle) => handle.jsonValue());

    item.prevPrice = await page
      .$(`span [data-id="previous-price"]`)
      .then((elem) => elem.getProperty("innerText"))
      .then(async (handle) => {
        const priceBeforeDiscount = await handle.jsonValue();
        return Number(priceBeforeDiscount.replace("ILS", ""));
      });

    item.discountPercent = await page
      .$(`span [class="product-discount-percent"]`)
      .then((elem) => elem.getProperty("innerText"))
      .then(async (handle) => {
        const priceBeforeDiscount = await handle.jsonValue();
        return Number(priceBeforeDiscount.replace(/[()\-%]/g, ""));
      });

    item.price = await page
      .$(`span[data-id="current-price"] `)
      .then((elem) => elem.getProperty("innerText"))
      .then(async (handle) => {
        const priceWithShach = await handle.jsonValue();
        return Number(priceWithShach.replace("ILS", ""));
      });

    item.rank = await page.$(`div[class="numeric-rating"]`).then((elem) => {
      if (!elem) return null;
      return elem.getProperty("innerText").then((handle) => handle.jsonValue());
    });

    item.imgSrc = await page
      .$(`div[class="fullImageContainer"] img`)
      .then((image) => image.getProperty("src"))
      .then((handle) => handle.jsonValue());

    openBrowser ? await page.close() : await browser.close();
    return item;
  } catch (error) {
    console.log(error);
    openBrowser ? await page.close() : await browser.close();
    return { error };
  }
}

module.exports = getPreview;
