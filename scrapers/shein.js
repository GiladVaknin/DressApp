const puppeteer = require("puppeteer");
const request = require("request");

async function shain({
  gender = "",
  category = "",
  productType = "",
  colors = [],
  sizes = [],
}) {
  const COLORS_TRANSLATE = {
    Navy: "Blue",
  };

  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 50,
    defaultViewport: { width: 3000, height: 2000 },
  });
  const page = await browser.newPage();
  const finalURL = "https://il.shein.com/" + gender;
  await page.goto(finalURL, { waitUntil: "networkidle0" });

  const bannerCloseButton = await page.$("i.svgicon-close");
  bannerCloseButton && (await bannerCloseButton.click());

  await page.waitForSelector(".header-v2__nav2");
  const categoryMenu = await page.$(".header-v2__nav2");
  const categoryButton = await categoryMenu.$(
    `a[title="${productType.toUpperCase()}"]`
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

      const searchColor = COLORS_TRANSLATE[color] || color;

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

  for (item of allItems) {
    await item.evaluate((node) => node.scrollIntoView(true));
  }

  //   getItem(allItems[0]);
  //   getItem(allItems[2]);
  //   getItem(allItems[1]);
  const allItemsFormatted = await Promise.all(
    allItems.map((i) => getItem(i, browser))
  );
  for (item of allItemsFormatted) {
    item.rank = await getRank(item.linkToBuy, browser);
  }
  await browser.close();
  return allItemsFormatted;
}

shain({
  gender: "men",
  category: "tops",
  productType: "tops",
  colors: ["Navy"],
  sizes: ["XL"],
}).then(console.log);

async function getItem(itemElem, browser) {
  const item = { storeName: "shein" };
  item.imgSrc = await itemElem
    .$("img.falcon-lazyload")
    .then((imgElem) => imgElem.getProperty("src"))
    .then((handle) => handle.jsonValue());

  item.title = await itemElem
    .$(".S-product-item__name")
    .then((elem) => elem.getProperty("innerText"))
    .then((handle) => handle.jsonValue());

  item.price = await itemElem
    .$(".S-product-item__retail-price")
    .then((elem) => elem.getProperty("innerText"))
    .then(async (handle) => {
      const priceWithShach = await handle.jsonValue();
      return Number(priceWithShach.replace("₪", ""));
    });

  item.linkToBuy = await itemElem
    .$("a.S-product-item__img-container")
    .then((elem) => elem.getProperty("href"))
    .then((handle) => handle.jsonValue());

  //   item.rank = await getRank(item.linkToBuy, browser);
  //   console.log(item);
  return item;
}

async function getRank(linkToBuy, browser) {
  request.post(
    "https://il.shein.com/goods_detail/goodsListComment?_lang=en",
    {
      headers: {
        referer:
          "https://il.shein.com/Men-Letter-Cartoon-Graphic-Tee-p-2041627-cat-1980.html",
      },
    },
    { spu_list: [{ spu: "M2012234422" }] }
  );
  const page = await browser.newPage();
  await page.goto(linkToBuy);
  //   await page.waitForNavigation();
  await page.waitForSelector(".product-intro__head-reviews");
  const rankElem = await page.$(".product-intro__head-reviews");

  const avgRatingText = await rankElem.$eval(
    "span",
    (
      node //Average Rating 4.9 5964 Reviews
    ) => node.getAttribute("aria-label")
  );

  const rank = Number(avgRatingText.split(" ")[2]);
  //   console.log(rank);
  page.close();
  return rank;
}
