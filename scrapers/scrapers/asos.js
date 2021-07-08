const puppeteer = require("puppeteer");
const BASE_URL = "https://www.asos.com";

const SIZE_VALUES = {
  XS: "5188",
  S: "4430",
  M: "4418",
  L: "5164",
  XL: "5176",
};

async function main(product) {
  const headless = process.env.headless || false;
  const browser = await puppeteer.launch({
    headless,
    slowMo: 50,
    defaultViewport: { width: 770, height: 1024 },
    timeout: 500000,
  });
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );
    await page.setViewport({ width: 770, height: 1024 });

    await page.goto(BASE_URL + "/" + product.gender);

    await page.waitForSelector('button[aria-label="Open navigation menu"]');
    const menu = await page.$('button[aria-label="Open navigation menu"]');
    await menu.click();
    const [category] = await page.$x(`//button[contains(., 'Clothing')]`);
    category && (await category.click());

    await page.waitForSelector("._1yLqhTn");
    const openMenu = await page.$("._2gD1b3A");
    const productType = await openMenu.$(`div[title='${product.productType}']`);

    productType && (await productType.evaluate((e) => e.click()));

    await page.waitForNavigation();

    if (product.colors?.length) {
      await page.waitForXPath(`//button[.='Colour']`, { visible: true });
      const [colour] = await page.$x(`//button[.='Colour']`);

      if (colour) {
        await colour.evaluate((node) => node.click());
        await page.setViewport({ width: 770, height: 1300 });
        for (const color of product.colors) {
          await page.waitForSelector(`li._3LB03xF`);
          const [colorBtn] = await page.$x(`//label[contains(., "${color}")]`);
          await colorBtn.click();
          await page.waitForXPath(`//label[contains(., "${color}")]`);
        }
      }
    }

    if (product.sizes?.length) {
      await page.waitForXPath(`//button[.='Size']`, { visible: true });
      const [size] = await page.$x(`//button[.='Size']`);

      if (size) {
        await size.click();

        for (const size of product.sizes) {
          const sizeValue = SIZE_VALUES[size];
          await page.waitForSelector(`li._3LB03xF div`);
          const sizeSelect = await page.$(`input[value='${sizeValue}']`);

          await sizeSelect.evaluate(async (node) => await node.click());

          await page.waitForSelector(`input[value='${sizeValue}']`);
        }
      }
    }
    await page.waitForSelector("._2qG85dG");
    const items = await page.$$("._2qG85dG");

    const allItemsFormatted = await Promise.all(
      items.map(async (item) => {
        const linkToBuy = await item
          .$("a._3TqU78D")
          .then((elem) => elem.getProperty("href"))
          .then((handle) => handle.jsonValue())
          .catch(console.log);

        return {
          storeName: "Asos",
          linkToBuy,
        };
      })
    );

    await browser.close();
    return allItemsFormatted.filter((val) => val);
  } catch (err) {
    console.log(err);
    browser.close();
  }
}

module.exports = main;
