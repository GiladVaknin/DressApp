const puppeteer = require("puppeteer");
require("dotenv").config();

const TRANSLATIONS = {
  men: {
    "Hoodies & Sweatshirts": "HOODIES & SWEATSHIRTS",
    "Co-ords": "TWO-PIECE SETS",
    Shorts: "Denim Shorts",
    Swimwear: "SWIMWEAR",
    "Polo shirts": "Polo",
    Activewear: "ACTIVEWEAR",
    Designer: "OUTERWEAR",
    "Jackets & Coats": "Coats & Jackets",
    Joggers: "Sweatpants",
    "Jumpers & Cardigans": "KNITWEAR",
    Multipacks: "MATCHING SETS",
  },
  women: {
    "Co-ords": "TWO-PIECE SETS",
    Activewear: "ACTIVEWEAR",
    "Hoodies & Sweatshirts": "SWEATSHIRTS",
    "Coats & Jackets": "COATS & JACKETS",
    "Jumpers & Cardigans": "SWEATERS",
    "Lingerie & Nightwear": "LINGERIE",
    "Swimwear & Beachwear": "BEACHWEAR",
    Tops: "TOPS",
  },
  colors: {
    Navy: "Blue",
    Neutral: "Khaki",
  },
};
module.exports = shain;
async function shain({
  gender = "",
  productType = "",
  colors = [],
  sizes = [],
}) {
  const headless = process.env.headless || false;
  const browser = await puppeteer.launch({
    headless,
    // slowMo: 50,
    defaultViewport: { width: 2000, height: 1500 },
  });
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 2000, height: 1500 });

    const finalURL = "https://il.shein.com/" + gender;
    await page.goto(finalURL);

    const bannerCloseButton = await page.$("i.svgicon-close");
    bannerCloseButton && (await bannerCloseButton.click());

    const clothing = await page.$(`a[title="CLOTHING"`);
    await clothing.hover();

    const searchType = TRANSLATIONS[gender][productType] || productType;
    await page.waitForSelector(".header-float__txt");
    const categoryButton = await page.$(`a[title="${searchType}"]`);

    await categoryButton.evaluate(async (e) => await e.click());

    if (colors.length) {
      for (color of colors) {
        await page.waitForSelector(`div[aria-label="Color"]`, {
          visible: true,
        });
        const colorMenu = await page.$(`div[aria-label="Color"]`);
        const isOpen = await colorMenu.evaluate((node) =>
          node.getAttribute("aria-expanded")
        );

        if (!isOpen) {
          await colorMenu.evaluate((node) => node.scrollIntoView());
          await page.click(`div[aria-label="Color"]`);
        }

        const searchColor = TRANSLATIONS.colors[color] || color;

        await page.waitForSelector(`img[title="${searchColor}"]`);
        const colorButton = await colorMenu.$(`img[title="${searchColor}"]`);
        colorButton &&
          (await colorButton.evaluate(async (e) => await e.click()));
      }
    }

    if (sizes.length) {
      for (size of sizes) {
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

        await page.waitForSelector(`div.side-filter__item-content-each`);
        const sizeButton = await sizeMenu.$(`input[value="${size}"]`);
        sizeButton && (await sizeButton.evaluate(async (e) => await e.click()));
      }
    }

    await page.waitForSelector("a.S-product-item__img-container");
    const allItems = await page.$$(".S-product-item");

    const allItemsFormatted = await Promise.all(
      allItems.map((i) => getItem(i))
    );

    await browser.close();
    return allItemsFormatted;
  } catch (error) {
    console.log(error);
  }
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
