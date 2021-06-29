const puppeteer = require("puppeteer");
require("dotenv").config();

module.exports = shain;
async function shain({
  gender = "",
  category = "",
  productType = "",
  colors = [],
  sizes = [],
}) {
  const TRANSLATIONS = {
    Navy: "Blue",
    Shirts: "Tops",
  };
  const headless = process.env.headless || false;
  const browser = await puppeteer.launch({
    headless,
    // slowMo: 50,
    defaultViewport: { width: 3000, height: 2000 },
  });
  const page = await browser.newPage();
  const finalURL = "https://il.shein.com/" + gender;
  await page.goto(finalURL);

  const bannerCloseButton = await page.$("i.svgicon-close");
  bannerCloseButton && (await bannerCloseButton.click());

  const searchType = TRANSLATIONS[productType] || productType;
  await page.waitForSelector(".header-v2__nav2");
  const categoryMenu = await page.$(".header-v2__nav2");
  const categoryButton = await categoryMenu.$(
    `a[title="${searchType.toUpperCase()}"]`
  );
  await categoryButton.evaluate(async (e) => await e.click());

  if (colors.length) {
    for (color of colors) {
      await page.waitForNavigation();
      await page.waitForSelector(`div[aria-label="Color"]`);
      const colorMenu = await page.$(`div[aria-label="Color"]`);
      const isOpen = await colorMenu.evaluate((node) =>
        node.getAttribute("aria-expanded")
      );

      if (!isOpen) {
        await colorMenu.evaluate((node) => node.scrollIntoView());
        await page.click(`div[aria-label="Color"]`);
      }

      const searchColor = TRANSLATIONS[color] || color;

      await page.waitForSelector(`img[title="${searchColor}"]`);
      const colorButton = await colorMenu.$(`img[title="${searchColor}"]`);
      await colorButton.evaluate(async (e) => await e.click());
    }
  }

  if (sizes.length) {
    for (size of sizes) {
      await page.waitForNavigation();
      await page.waitForSelector(`div[aria-label="Size"]`);
      const sizeMenu = await page.$(`div[aria-label="Size"]`);
      const isOpen = await sizeMenu.evaluate((node) =>
        node.getAttribute("aria-expanded")
      );

      if (!isOpen) {
        await sizeMenu.evaluate((node) => node.scrollIntoView());
        await page.click(`div[aria-label="Size"]`);
      }
      const viewMore = await sizeMenu.$(".side-filter__item-viewMore");
      viewMore && (await viewMore.click());

      await page.waitForSelector(`input[value="${size}"]`);
      const sizeButton = await sizeMenu.$(`input[value="${size}"]`);
      await sizeButton.evaluate(async (e) => await e.click());
    }
  }

  await page.waitForSelector("a.S-product-item__img-container");
  const allItems = await page.$$(".S-product-item");

  const allItemsFormatted = await Promise.all(allItems.map((i) => getItem(i)));

  await browser.close();
  return allItemsFormatted;
}

async function getItem(itemElem) {
  const item = { storeName: "Shein" };

  item.linkToBuy = await itemElem
    .$("a.S-product-item__img-container")
    .then((elem) => elem.getProperty("href"))
    .then((handle) => handle.jsonValue());

  return item;
}

// shain({
//   gender: "men",
//   category: "tops",
//   productType: "tops",
//   colors: ["Navy"],
//   sizes: ["XL"],
// }).then(console.log);
