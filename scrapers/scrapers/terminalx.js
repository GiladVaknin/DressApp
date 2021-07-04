const e = require("cors");
const puppeteer = require("puppeteer");
require("dotenv").config();

const TRANSLATIONS = {
  men: {
    "Co-ords": "none",
    Jeans: "ג'ינסים",
    Shirts: "חולצות",
    Shorts: "מכנסיים קצרים",
    Swimwear: "בגדי ים",
    "Polo shirts": "פולו",
    Activewear: "אקטיב",
    Designer: "none",
    "Hoodies & Sweatshirts": "סוודרים וסווטשירטים",
    "Jackets & Coats": "ג'קטים ומעילים",
    Joggers: "מכנסי טרנינג",
    "Jumpers & Cardigans": "קרדדיגנים",
    Underwear: "תחתונים",
    Multipacks: "none",
  },
  women: {
    "Co-ords": "חליפות",
    Jeans: "ג'ינסים",
    Shorts: "מכנסיים קצרים",
    Activewear: "אקטיב",
    "Hoodies & Sweatshirts": "סוודרים וסווטשירטים",
    "Coats & Jackets": "ג'קטים ומעילים",
    "Jumpers & Cardigans": "קרדיגנים",
    "Lingerie & Nightwear": "הלבשה תחתונה",
    Skirts: "שמלות וחצאיות",
    "Swimwear & Beachwear": "בגדי ים",
    Tops: "חולצות",
  },
  colors: {
    Black: "שחור",
    Blue: "כחול",
    Brown: "חום",
    Green: "ירוק",
    Grey: "אפור",
    Multi: "מולטי",
    Navy: "כחול",
    Neutral: "ניוד",
    Pink: "ורוד",
    Purple: "סגול",
    Red: "אדום",
    White: "לבן",
    Yellow: "צהוב",
  },
  genders: {
    men: "גברים",
    women: "נשים",
  },
};

module.exports = main;
async function main({
  gender = "",
  productType = "",
  colors = [],
  sizes = [],
}) {
  if (TRANSLATIONS[gender][productType] === "none") return Promise.resolve([]);

  const headless = process.env.headless || false;
  const browser = await puppeteer.launch({
    headless,
    // slowMo: 50,
    defaultViewport: { width: 1600, height: 1000 },
  });
  const page = await browser.newPage();
  const finalURL = "https://www.terminalx.com/";
  await page.goto(finalURL);
  const genderSearch = TRANSLATIONS.genders[gender];
  const genderButton = await page.$(`a[title="${genderSearch}"`);
  await genderButton.hover();

  await page.waitForSelector(".container_5D-U.open_3sih");
  const typeMenu = await page.$(".container_5D-U.open_3sih");
  const searchType = TRANSLATIONS[gender][productType] || productType;
  const typeButton = await typeMenu.$(`a[title="${searchType}"]`);
  await typeButton.evaluate(async (e) => await e.click());

  if (colors.length) {
    await page.waitForSelector("h4.title_ramR", { visible: true });
    const [colorMenuButton] = await page.$x("//h4[contains(text(),'צבע')]");
    await colorMenuButton.evaluate((e) => e.click());

    for (color of colors) {
      await page.waitForSelector(`ol.filter-items-color_1yRV`, {
        visible: true,
      });
      const colorMenu = await page.$(`ol.filter-items-color_1yRV`);
      const searchColor = TRANSLATIONS.colors[color] || color;
      const colorButton = await colorMenu.$(`a[title="${searchColor}"]`);

      colorButton && (await colorButton.evaluate((e) => e.click()));
      await page.waitForRequest("https://www.google-analytics.com/collect"); //request fires up the moment loading is done
    }
  }

  if (sizes.length) {
    await page.waitForSelector("h4.title_ramR", { visible: true });
    const [colorMenuButton] = await page.$x("//h4[contains(text(),'מידה')]");
    await colorMenuButton.evaluate((e) => e.click());

    for (size of sizes) {
      await page.waitForSelector(`ol.filter-items_1wKn`, {
        visible: true,
      });
      const sizeMenu = await page.$(`ol.filter-items_1wKn`);
      const sizeButton = await sizeMenu.$(`a[title="${size}"]`);

      sizeButton && (await sizeButton.evaluate((e) => e.click()));
      await page.waitForRequest("https://www.google-analytics.com/collect"); //request fires up the moment loading is done
    }
  }

  await page.waitForSelector("li.listing-product_3mjp");
  const allItems = await page.$$("li.listing-product_3mjp");

  const allItemsFormatted = await Promise.all(allItems.map((i) => getItem(i)));

  await browser.close();
  return allItemsFormatted;
}

async function getItem(itemElem) {
  const item = { storeName: "TerminalX" };

  item.linkToBuy = await itemElem
    .$("a")
    .then((elem) => elem.getProperty("href"))
    .then((handle) => handle.jsonValue());

  return item;
}

// main({
//   gender: "men",
//   productType: "Shirts",
//   colors: ["Black", "Blue"],
//   sizes: ["L", "XL"],
// }).then(console.log);
