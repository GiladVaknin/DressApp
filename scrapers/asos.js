const puppeteer = require("puppeteer");
const BASE_URL = "https://www.asos.com";
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function main(product) {
  const headless = process.env.headless || false;

  try {
    const browser = await puppeteer.launch({
      headless,
      slowMo: 50,
      defaultViewport: { width: 770, height: 1024 },
      timeout: 500000,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.goto(BASE_URL + "/" + product.gender, {
      waitUntil: "networkidle2",
    });
    const menu = await page.$('button[aria-label="Open navigation menu"]');
    await menu.click();
    const [category] = await page.$x(
      `//button[contains(., '${product.category}')]`
    );

    if (category) {
      await category.click();
    }
    const [productType] = await page.$x(
      `//a[contains(., '${product.productType}')]`
    );

    if (productType) {
      await productType.evaluate((e) => e.click());
    }

    await page.waitForNavigation();
    const [colour] = await page.$x(`//button[contains(., 'Colour')]`);

    if (colour) {
      await colour.click();
      await page.setViewport({ width: 770, height: 1300 });
      for (const color of product.colors) {
        await page.waitForSelector(`li._3LB03xF`);
        const [colorBtn] = await page.$x(`//label[contains(., "${color}")]`);
        await colorBtn.click();
        // await page.waitForNavigation({ waitUntil: "networkidle2" });
      }
    }

    const [size] = await page.$x(`//button[contains(., 'Size')]`);

    if (size) {
      await page.setViewport({ width: 770, height: 1024 });
      await size.evaluate((node) => node.click());
      for (const size of product.sizes) {
        await page.waitForSelector(`li._3LB03xF`);
        const [sizeSelect] = await page.$x(`//label[contains(., '${size}')]`);
        await sizeSelect.click();
        // await page.waitForNavigation({ waitUntil: "networkidle2" });
      }
    }

    const items = await page.$$("._2qG85dG");
    const allItemsFormatted = [];

    if (items) {
      for (item of items) {
        const itemLink = await item
          .$("a._3TqU78D")
          .then((elem) => elem.getProperty("href"))
          .then((handle) => handle.jsonValue());
        allItemsFormatted.push({
          storeName: "Asos",
          linkToBuy: itemLink,
        });
      }
    }

    await browser.close();
    const abort = () => {
      browser.close();
    };
    return allItemsFormatted;
  } catch (err) {
    console.log(
      "MAINERR!!!!!!!!!!!!!!!! =================================================== \n " +
        err
    );
  }
}

async function getItem(itemElem) {
  const item = { storeName: "Asos" };

  item.title = await itemElem
    .$("._3J74XsK")
    .then((elem) => elem.getProperty("innerText"))
    .then((handle) => handle.jsonValue());

  item.price = await itemElem
    .$("._16nzq18")
    .then((elem) => elem.getProperty("innerText"))
    .then(async (handle) => {
      const priceWithShach = await handle.jsonValue();
      return Number(priceWithShach.replace("ILS", ""));
    });

  item.linkToBuy = await itemElem
    .$("a._3TqU78D")
    .then((elem) => elem.getProperty("href"))
    .then((handle) => handle.jsonValue());

  item.rank = await getRank(item.linkToBuy);
  item.imgSrc = await getImgSrc(item.linkToBuy);

  return item;
}

async function getRank(itemLink, secondTry) {
  var data = "";

  var config = {
    method: "get",
    url: itemLink,
    headers: {
      Cookie:
        "_abck=BC3E379FA5195C118296920B40183288~-1~YAAQpJf2SMX2RBh6AQAAUhoyJgbZcFl+WzwhJrd69PV4orD1wVaHJxwAWQMnYf3oqRYY7McmqwxJefioyrGiH5uSRNpXuw72xKPMQ4ox4iWriGdaVA6jU3skElkFGKiNkAn6fP1a9jF6ZuqO0erpn83SfBcwv8cjlnjlC6a7Tale+SVC6pCdHRzE12FK6ZlyQc48PUcjcQuNg1kbKyhD/FU9M8mGWpy8C66hSl5loSeepeh1nOri2DG58vfHvCcxCSuLCArzDb8CwWL06ecxyJ5hRfm7VPKFH15CjKxoRtSVpUR8hDikTv3lfqSxSRGOxKFIVCJhNFG9VlIEty0f6mZIWe2anHHvEnXhLtHXqMSjydajeJpEunVmVS+m1KRCIG8vBxc=~-1~-1~-1; bm_sz=734C3652FA6965C69CA1A67BEA4CB858~YAAQpJf2SMT2RBh6AQAAUhoyJgzj8kKHV0QX/q0/jFdkOpbe5Ai2xgSopgHtg8eS9akotlg/g7PXmtfx04bbk57YshzcgLn3pC5NrdviZ4Lp+HoeTsexVT/bArA8/xz6COLsLZ1WuvMI3rAmh1sihOIQ4sNv9BgM9RGlGinXso7YGVUii2fnzH34O4PcPw==; geocountry=IL",
    },
    data: data,
  };

  return axios(config)
    .then(async function (response) {
      const data = JSON.stringify(response.data);
      const t = data.indexOf(`averageOverallRating`);
      const d = data.slice(t + 23, t + 26);
      const needFix = d.indexOf(",");
      const ut = d.indexOf("ut");

      if (ut !== -1) {
        return secondTry ? null : await getRank(itemLink, true);
      }
      if (needFix !== -1) {
        return d.slice(0, needFix);
      }
      return d;
    })
    .catch(function (error) {
      console.log("error in RANK");
    });
}

async function getImgSrc(itemLink) {
  var data = "";

  var config = {
    method: "get",
    url: itemLink,
    headers: {
      Cookie:
        "_abck=BC3E379FA5195C118296920B40183288~-1~YAAQpZf2SFB3tSd6AQAAi4x7Kgai7Ea4cVHwM0ZjhScj0fjlm5ZaE70yXbXKUSZnKp8w0bebwEw/w20KmgKhkNkf97RFdouAuhu2tsGghGISyAyFLCB3aUhIPCeSU7PD/ZuWoDXwtE0/tV41toZIOwar/9KyLo0JYt59+I8FSMdwnsiEFgMuqTm0HTBPUcv/vutW7tgvMXR8IGE+15kKv1EObAVS47VTrsWpiXDdqhyFLOmFyCm8iFWbofk/MOmimg7GTxkMnt///mVxnrDcl9TSavb+UXfFMNAouXFgKIOHQ+aEuMbWu/8ioSLZkrFM0dKLZ39JuMJ/xVpA5OeUOLzg1B3tIIAhSxxQil0Z/EjEPKmfdGE6k9K0DEfGdgheo5I5lZc=~-1~-1~-1; bm_sz=82DA8D51AB0F00505437788642B6D38C~YAAQpZf2SE93tSd6AQAAi4x7Kgy9S7c4694gfpWNQ9XF63/SJas3uRgz9IORrCNRWqKJ4jNXl+jzOrTOeWxIM86ucCIJZcrvIgxwdUPNI36Ij1dMe+DwhmOZl1lCocEaRMv74QjaWFwGLppuoWC9WkNsgtOrrymWeHYARpGPnTiVarWuh6WJdRziSL+n8w==; geocountry=IL",
    },
    data: data,
  };

  return axios(config)
    .then(async function (response) {
      const { window } = await new JSDOM(response.data, {
        runScripts: "dangerously",
      });

      return window.window.asos.pdp.config.product.images[0].url;
    })
    .catch(function (error) {
      console.log("error in imgSRC");
    });
}

module.exports = main;
