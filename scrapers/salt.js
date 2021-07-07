// const { genSaltSync } = require("bcrypt");
// console.log(genSaltSync(1));
const axios = require("axios");
const arr = [
  {
    storeName: "Shein",
    linkToBuy:
      "https://il.shein.com/SUNNY-LACE-Padded-Convertible-Bralette-p-1884852-cat-2203.html?scici=navbar_WomenHomePage~~tab01navbar05menu10~~5_10~~real_2195~~~~0",
  },
  {
    storeName: "Asos",
    linkToBuy:
      "https://www.asos.com/asos-design/asos-design-cotton-stripe-long-sleeve-shirt-short-pyjama-set-in-pink-red/prd/23343275?colourwayid=60473186&cid=6046",
  },
  {
    storeName: "TerminalX",
    linkToBuy:
      "https://www.terminalx.com/women/lingerie/x636545037?color=11830",
  },
  {
    storeName: "Shein",
    linkToBuy:
      "https://il.shein.com/SUNNY-LACE-Padded-Classic-Strap-Bralette-p-1884782-cat-2203.html?scici=navbar_WomenHomePage~~tab01navbar05menu10~~5_10~~real_2195~~~~0",
  },
  {
    storeName: "Asos",
    linkToBuy:
      "https://www.asos.com/calvin-klein/calvin-klein-plus-size-ck-one-lace-lingerie-set-in-red/grp/47708?colourwayid=60471943&cid=6046#23327440",
  },
  {
    storeName: "TerminalX",
    linkToBuy: "https://www.terminalx.com/women/lingerie/x636545073?color=9012",
  },
  {
    storeName: "Shein",
    linkToBuy:
      "https://il.shein.com/X-Ubras-ONE-Seamless-Padded-Scoop-Bralet-p-2656530-cat-2203.html?scici=navbar_WomenHomePage~~tab01navbar05menu10~~5_10~~real_2195~~~~0",
  },
  {
    storeName: "Asos",
    linkToBuy:
      "https://www.asos.com/calvin-klein/calvin-klein-plus-size-ck-one-lace-lingerie-set-in-red/grp/47708?colourwayid=60471944&cid=6046",
  },
  {
    storeName: "TerminalX",
    linkToBuy: "https://www.terminalx.com/women/lingerie/x636545100?color=9095",
  },
];
Promise.all(
  arr.map((query) =>
    axios
      .post("http://localhost:8080/api/preview", { query })
      .then((r) => r.data)
  )
).then(console.log);
