const puppeteer = require("puppeteer");
const request = require("request");
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
  const { headless } = process.env;
  const browser = await puppeteer.launch({
    headless,
    // slowMo: 50,
    defaultViewport: { width: 3000, height: 2000 },
  });
  const page = await browser.newPage();
  const finalURL = "https://il.shein.com/" + gender;
  await page.goto(finalURL, { waitUntil: "networkidle2" });

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

  for (item of allItems) {
    await item.evaluate((node) => node.scrollIntoView(true));
  }

  const allItemsFormatted = await Promise.all(allItems.map((i) => getItem(i)));

  await browser.close();
  return allItemsFormatted;
}

// shain({
//   gender: "men",
//   category: "tops",
//   productType: "tops",
//   colors: ["Navy"],
//   sizes: ["XL"],
// }).then(console.log);

async function getItem(itemElem) {
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

  const itemSPU = await itemElem.$eval(
    "a.S-product-item__img-container",
    (node) => node.getAttribute("data-spu")
  );

  item.rank = await getRank(itemSPU, item.linkToBuy);

  return item;
}

async function getRank(itemSPU, itemLinkToBuy) {
  const options = {
    method: "POST",
    url: "https://il.shein.com/goods_detail/goodsListComment?_lang=en",
    headers: {
      Referer: itemLinkToBuy,
      Origin: "https://il.shein.com",
      "Content-Type": "application/json",
      Cookie:
        "_abck=8DFFFA3F50DC46721AF3D50CE5F40CE2~-1~YAAQlhc51UcekxZ6AQAAE99dGwaXQyuRgoDtFKdWj8vXYzS8xJcKcA88EsCcuflUSIFrtJ8zUlfPEdxIiJ4CSCiCFU2wB9GpcoYlxsJEhBKPThYXc5hsxbNVvLfm3SGwVv9kXmDLDXAH9PGccTPn4H9cGDGE/Y0SfgnS+l6jSHk0v+DJNT2L8hRtgpMxaerDpmRe60XWQ9XPNNllBjR1XFyMHYtLWoON7vsvaoQbjs2HcpolyAdhOt5t/5me46eD1bzwPlYxlCSF3O9osiYnWn2/KcCqtKv6+7tvQRDI5CCSy+rQVrJbaFGO8BtvEhChnyk38KBuufRfMf9AD3JkfkSJHXvhYtuHdTazZj8+7+VHHY8VYPOlxA==~-1~-1~-1; ak_bmsc=4630116E2DEFBDA42023C39BEAD998DE~000000000000000000000000000000~YAAQlhc51UgekxZ6AQAAE99dGwxORkBBgOExfsw3e2oHJBE4ffWdB3TaXdXKbn4zIUsQjevRjh82TaUFiEXe1QTkPxGjUi7A2N6Z4boRv364h5je5DkG7u8lO+7EHd38gtADZYStg6l7SeG4Tbb5yP+1soXuKK7sWEaiR1eaoQtNZLVwgMBbyo/M9OxzD8Fp+IWzwYb1XAxSwqyfAmFRSz1pNHl927Z/F2ygMEdKeYx9faV6RAlOQ66UPWeLVipNq8gb+wdjEI148ykVT/lcxs75jK8AEAU+SWItxgWdvTUHNi4QVE+fNipjFTUuirJj4DjKWGioJzp59asB78lfxgb07EtonW1K/+JX8IL3mSM732LHlRNfgw==; bm_sv=C591AF652371C607B38585E06D8FB023~tAEDOgSaS1TFHcNnI/lEQoATRjn9kQ34FiLlgnvOMEz2x3QM5nUR1JTNKSqeSVrzQMogxYwZp8p2qqgeanX0F/uviqg81WtefAo90aTbGjpkcZGKEjbkZ1za5Pma5+w5rg7J0twlHx3au0CRtkvcDeNtOqdUgrxLeV6XVFXtZtQ=; bm_sz=7C910C40899E9581CE3559B9849F3BDB~YAAQlhc51UYekxZ6AQAAE99dGwzlsQRF01pfPaoK+RAGGXzUbJBR8yMNKaudbMuiRw7r9jJ4UpxPJF7iXh5CGFyFWUjI/rQE7u9zR7xFGjoG4p86/FKLEl349qWgMfE056HQbqGQzq6OM7DFZPwYcDQAUqjlvXFBvtoIdo5jExVmt2A/yHWlRzwvZNEN0J0=; cate_channel_type=2; cdn_key=illang%3Dil; cookieId=BBC61EEE_01AE_FB14_D2D5_5AEF0ABB97AE; default_currency=ILS; sessionID_shein=s%3AiEck3oPH-981ddzfEhfmJu1UdQlKbsPg.SKkLl0KgJBH0pkTDdHRMc9sEfPOD%2FBVTzPM2ByWnT8o",
    },
    body: JSON.stringify({
      spu_list: [
        {
          spu: itemSPU,
        },
      ],
    }),
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) return resolve(error);
      body = JSON.parse(body);
      if (!body.info || !body.info.length) return resolve(null);
      const rank = body.info[0]["comment_rank_average"];
      resolve(Number(rank));
    });
  });
}
