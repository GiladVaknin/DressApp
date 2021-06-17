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

      await page.waitForSelector(`img[title="${color}"]`);
      const colorButton = await colorMenu.$(`img[title="${color}"]`);
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
  const allUrls = await Promise.all(
    await page
      .$$("a.S-product-item__img-container")
      .then((elements) =>
        elements.map(
          async (el) =>
            await el.evaluate(
              (node) => "https://il.shein.com" + node.getAttribute("href")
            )
        )
      )
  );

  getItem(allUrls[0], browser);
  //   getItem(allUrls[1], browser);
  //   getItem(allUrls[2], browser);
  //   await browser.close();
  //   return await Promise.all(allUrls.map(getItem));
}

async function getItem(itemUrl, browser) {
  const page = await browser.newPage();
  await page.goto(itemUrl);
  await page.waitForSelector(".loaded");
  console.log("NAVIGATION");
  const imgSrc = await page
    .$("img.j-verlok-lazy.loaded")
    .then((imgElem) => imgElem.getProperty("data-src"));

  console.log(imgSrc);

  //   return new Promise((resolve, reject) => {
  //     request.get(itemUrl, { timeout: 10000 }, async (err, response, body) => {
  //       if (err) reject(err);
  //       const item = { linkToBuy: itemUrl };

  //       const $ = cheerio.load(body);
  //       const imgSrc = $(".swiper-slide-active");
  //       console.log(imgSrc.html());
  //       //   console.log($.html());
  //     });
  //   });
}
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
  category: "tops",
  productType: "tops",
  colors: ["Black"],
  sizes: ["XL"],
});
