import "./styles/app.css";
import Item from "./components/Item";
import FilterPannel from "./components/FilterPannel";

import { useState, useEffect } from "react";
const axios = require("axios");

function App() {
  const exc = [
    {
      storeName: "Asos",
      linkToBuy:
        "https://www.asos.com/south-beach/south-beach-scrunch-exaggerated-bikini-set-in-orange/grp/203937?colourwayid=60424450&cid=27428#22770569",
    },
    {
      storeName: "Asos",
      linkToBuy:
        "https://www.asos.com/topshop/topshop-shirred-crop-bikini-top-in-purple/prd/200402846?colourwayid=200402850&cid=2238",
    },
    {
      storeName: "Asos",
      linkToBuy:
        "https://www.asos.com/south-beach/south-beach-scrunch-exaggerated-bikini-set-in-orange/grp/203937?colourwayid=60424450&cid=27428#22770569",
    },
    {
      storeName: "Asos",
      linkToBuy:
        "https://www.asos.com/south-beach/south-beach-scrunch-exaggerated-bikini-set-in-orange/grp/203937?colourwayid=60424450&cid=27428#22770569",
    },
    {
      storeName: "Asos",
      linkToBuy:
        "https://www.asos.com/asos-design/asos-design-textured-beach-shorts-and-shirt-in-white/grp/33061?colourwayid=60306022&cid=2238#21876229",
    },
    {
      storeName: "Asos",
      linkToBuy:
        "https://www.asos.com/reclaimed-vintage/reclaimed-vintage-inspired-recycled-underwired-bikini-top-in-snake-print/prd/23193742?colourwayid=60458087&cid=2238",
    },
  ];

  const [items, setItems] = useState([
    {
      storeName: "Shein",
      linkToBuy:
        "https://il.shein.com/SUNNY-LACE-Padded-Convertible-Bralette-p-1884852-cat-2203.html?scici=navbar_WomenHomePage~~tab01navbar05menu10~~5_10~~real_2195~~~~0",
      imgSrc:
        "https://img.ltwebstatic.com/images3_pi/2021/04/08/161788289107595cc22ff57333c39a54310a31b4d9_thumbnail_900x.webp",
      title: "Luvlette SUNNY LACE Padded Convertible Bralette",
      price: 44,
      prevPrice: null,
      discountPercent: null,
      rank: 4.9,
    },
    {
      storeName: "Asos",
      title:
        "ASOS DESIGN cotton stripe long sleeve shirt & short pyjama set in pink & red",
      prevPrice: 0,
      discountPercent: 0,
      price: 150,
      linkToBuy:
        "https://www.asos.com/asos-design/asos-design-cotton-stripe-long-sleeve-shirt-short-pyjama-set-in-pink-red/prd/23343275?colourwayid=60473186&cid=6046",
      rank: null,
      imgSrc:
        "https://images.asos-media.com/products/asos-design-cotton-stripe-long-sleeve-shirt-short-pyjama-set-in-pink-red/23343275-4?$n_640w$&wid=513&fit=constrain",
    },
    {
      storeName: "TerminalX",
      linkToBuy:
        "https://www.terminalx.com/women/lingerie/x636545037?color=11830",
      imgSrc:
        "https://media.terminalx.com/pub/media/catalog/product/cache/f112238e8de94b6d480bd02e7a9501b8/x/6/x636545037-11625117712.jpg",
      title: "חזיית תחרה עם רקמת פרחים / נשים",
      prevPrice: null,
      price: 119.9,
      discountPercent: null,
    },
    {
      storeName: "Shein",
      linkToBuy:
        "https://il.shein.com/SUNNY-LACE-Padded-Classic-Strap-Bralette-p-1884782-cat-2203.html?scici=navbar_WomenHomePage~~tab01navbar05menu10~~5_10~~real_2195~~~~0",
      imgSrc:
        "https://img.ltwebstatic.com/images3_pi/2021/01/28/1611812824abef36c1e2add4e1f70663cb13bafd5f_thumbnail_900x.webp",
      title: "Luvlette SUNNY LACE Padded Classic Strap Bralette",
      price: 39,
      prevPrice: null,
      discountPercent: null,
      rank: 4.9,
    },
    {
      storeName: "Asos",
      title: "Calvin Klein Plus Size CK One lace lingerie set in red",
      prevPrice: 0,
      discountPercent: 0,
      price: 180,
      linkToBuy:
        "https://www.asos.com/calvin-klein/calvin-klein-plus-size-ck-one-lace-lingerie-set-in-red/grp/47708?colourwayid=60471944&cid=6046",
      rank: null,
      imgSrc:
        "https://images.asos-media.com/products/calvin-klein-plus-size-ck-one-lace-bikini-shape-brief-in-red/23327440-1-red?$n_640w$&wid=513&fit=constrain",
    },
    {
      storeName: "TerminalX",
      linkToBuy:
        "https://www.terminalx.com/women/lingerie/x636545073?color=9012",
      imgSrc:
        "https://media.terminalx.com/pub/media/catalog/product/cache/f112238e8de94b6d480bd02e7a9501b8/x/6/x636545073-11625117712.jpg",
      title: "חזיית תחרה עם רקמת פרחים / נשים",
      prevPrice: null,
      price: 119.9,
      discountPercent: null,
    },
    {
      storeName: "Shein",
      linkToBuy:
        "https://il.shein.com/X-Ubras-ONE-Seamless-Padded-Scoop-Bralet-p-2656530-cat-2203.html?scici=navbar_WomenHomePage~~tab01navbar05menu10~~5_10~~real_2195~~~~0",
      imgSrc:
        "https://img.ltwebstatic.com/images3_pi/2021/06/07/16230334186aed8ad6aa95cb27f97625a52ecbee31_thumbnail_900x.webp",
      title: "Luvlette X Ubras ONE Seamless Padded Scoop Bralette",
      price: 39,
      prevPrice: 49,
      discountPercent: 20,
      rank: 4.8,
    },
    {
      storeName: "Asos",
      title: "Calvin Klein Plus Size CK One lace lingerie set in red",
      prevPrice: 0,
      discountPercent: 0,
      price: 180,
      linkToBuy:
        "https://www.asos.com/calvin-klein/calvin-klein-plus-size-ck-one-lace-lingerie-set-in-red/grp/47708?colourwayid=60471944&cid=6046",
      rank: null,
      imgSrc:
        "https://images.asos-media.com/products/calvin-klein-plus-size-ck-one-lace-bikini-shape-brief-in-red/23327440-1-red?$n_640w$&wid=513&fit=constrain",
    },
    {
      storeName: "TerminalX",
      linkToBuy:
        "https://www.terminalx.com/women/lingerie/x636545100?color=9095",
      imgSrc:
        "https://media.terminalx.com/pub/media/catalog/product/cache/f112238e8de94b6d480bd02e7a9501b8/x/6/x636545100-11625117712.jpg",
      title: "חזיית תחרה עם רקמת פרחים / נשים",
      prevPrice: null,
      price: 119.9,
      discountPercent: null,
    },
  ]);

  // useEffect(() => {
  //   getItems({
  //     gender: "women",
  //     category: "Clothing",
  //     productType: "Tops",
  //     colors: ["Black"],
  //     sizes: ["S"],
  //   }).then((res) => setItems(res.data));
  // }, []);

  function getItems(query) {
    return axios({
      method: "POST",
      url: "http://localhost:8080/api/filter",
      data: {
        query: query,
      },
    })
      .then((res) => {
        console.log(res);
        setItems(res.data);
      })
      .catch(console.log);
  }

  return (
    <div className="App">
      <div id="header"></div>
      <FilterPannel getItems={getItems} />
      <div className="items">
        {items.map((item) => {
          return <Item item={item} />;
        })}
      </div>
    </div>
  );
}

export default App;
