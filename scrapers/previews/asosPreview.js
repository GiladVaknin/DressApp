const puppeteer = require("puppeteer");

async function getPreview(linkToBuy) {
  const item = { storeName: "Asos" };
  const headless = process.env.headless || false;
  const browser = await puppeteer.launch({
    headless,
    defaultViewport: { width: 770, height: 1024 },
    timeout: 500000,
  });

  const page = await browser.newPage();

  await page.goto(linkToBuy, {
    waitUntil: "networkidle2",
  });

  item.title = await page
    .$("div .product-hero h1")
    .then((elem) => elem.getProperty("innerText"))
    .then((handle) => handle.jsonValue());

  item.prevPrice = await page
    .$(`span [data-id="previous-price"]`)
    .then((elem) => elem.getProperty("innerText"))
    .then(async (handle) => {
      const priceBeforeDiscount = await handle.jsonValue();
      return Number(priceBeforeDiscount.replace("ILS", "")) ;
    });
  item.discountPercent = await page
    .$(`span [class="product-discount-percent"]`)
    .then((elem) => elem.getProperty("innerText"))
    .then(async (handle) => {
      const priceBeforeDiscount = await handle.jsonValue();
      return Number(priceBeforeDiscount.replace(/[()\-%]/g,""));
    });

  item.price = await page
    .$(`span[data-id="current-price"] `)
    .then((elem) => elem.getProperty("innerText"))
    .then(async (handle) => {
      const priceWithShach = await handle.jsonValue();
      return Number(priceWithShach.replace("ILS", ""));
    });

  item.linkToBuy = linkToBuy;
  item.rank=await page.$(`div[class="numeric-rating"]`)
  .then((elem) =>{
    if(!elem)return null
     return elem.getProperty("innerText")
     .then(handle=>handle.jsonValue());
  })
 

  item.imgSrc= await page.$(`div[class="fullImageContainer"] img`)
  .then((image)=>image.getProperty('src')).then(handle=>handle.jsonValue());
  console.log(item);
  await browser.close();
  return item;
}

module.exports=getPreview;