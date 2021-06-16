const puppeteer = require("puppeteer");
const request = require("request");
const cheerio = require("cheerio");

async function shain({
  gender = "",
  category = "",
  productType = "",
  colors = [],
  sizes = [],
}) {
  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 50,
    defaultViewport: { width: 1600, height: 2000 },
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
      await page.waitForSelector(`div[aria-label="Color"]`);
      const colorMenu = await page.$(`div[aria-label="Color"]`);
      const isOpen = await colorMenu.evaluate((node) =>
        node.getAttribute("aria-expanded")
      );
      if (!isOpen) {
        await colorMenu.evaluate((node) => node.scrollIntoView(true));
        await new Promise(async (res) => {
          console.log(
            await colorMenu.evaluate((node) => node.firstElementChild.click())
          );
          console.log("clicked");
          setTimeout(res, 10000);
        });
      }
      await page.waitForNavigation();
      await page.waitForSelector(`img[title="${color}"]`);
      const colorButton = await colorMenu.$(`img[title="${color}"]`);
      await colorButton.hover();
      await colorButton.evaluate(async (e) => await e.click());
      await page.waitForNavigation();
    }
  }

  if (sizes.length) {
    await page.waitForSelector(`div[aria-label="Size"]`);
    const sizeMenu = await page.$(`div[aria-label="Size"]`);
    const isOpen = await sizeMenu.evaluate((node) =>
      node.getAttribute("aria-expanded")
    );
    if (!isOpen) {
      await sizeMenu.evaluate((node) => node.scrollIntoView(true));
      await new Promise(async (res) => {
        await sizeMenu.evaluate((node) => node.firstElementChild.click());
        res();
      });
    }
    const allSizeButtons = sizeMenu.$$eval(".S-checkbox", (node) => {
      console.log(node.innerText);
      if (node.innerText) console.log("sd");
    });
    for (size of sizes) {
      await page.waitForSelector(`img[title="${size}"]`);
      const colorButton = await colorMenu.$(`img[title="${size}"]`);
      await colorButton.hover();
      await new Promise((res) => setTimeout(res, 5000));
      await colorButton.evaluate(async (e) => await e.click());
    }

    // const items = await page.$$(".S-product-item");
    // const allItems = [];
    // for (let i = 0; i < items.length; i++) {
    //   const item = items[i];
    //   await item.evaluate((node) => node.scrollIntoView(true));
    //   allItems.push(await getItem(item));
    // }
  }
  //   setTimeout(() => browser.close(), 10000);
}

// async function getItem(item) {
//   const { imgSrc, productURL, productName, price } = stores.shein.OUTPUT;
//   const isInView = await item.isIntersectingViewport();
//   if (!isInView) {
//     await item.evaluate((node) => node.scrollIntoView(true));
//   }

//   const outputItem = {};
//   const nameDiv = await item.$(productName.selector);
//   outputItem.productName = await nameDiv
//     .getProperty(productName.property)
//     .then((v) => v._remoteObject.value);

//   const urlElement = await item.$(productURL.selector);
//   outputItem.productURL = await urlElement
//     .getProperty(productURL.property)
//     .then((v) => v._remoteObject.value);

//   const priceElement = await item.$(price.selector);
//   outputItem.price = await priceElement
//     .getProperty(price.property)
//     .then((v) => v._remoteObject.value);

//   const imgElement = await item.$(imgSrc.selector);
//   outputItem.imgsrc = await imgElement
//     .getProperty(imgSrc.property)
//     .then((v) => v._remoteObject.value);

//   console.log(outputItem);
// }

shain({
  gender: "men",
  category: "Clothing",
  productType: "clothing",
  colors: ["Black", "Brown", "Red"],
});
