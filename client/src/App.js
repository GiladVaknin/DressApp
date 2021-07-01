import logo from "./logo.svg";
import "./App.css";
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
    // {
    //   storeName: "Asos",
    //   linkToBuy:
    //     "https://www.asos.com/topshop/topshop-shirred-crop-bikini-top-in-purple/prd/200402846?colourwayid=200402850&cid=2238",
    // },
    // {
    //   storeName: "Asos",
    //   linkToBuy:
    //     "https://www.asos.com/south-beach/south-beach-scrunch-exaggerated-bikini-set-in-orange/grp/203937?colourwayid=60424450&cid=27428#22770569",
    // },
    // {
    //   storeName: "Asos",
    //   linkToBuy:
    //     "https://www.asos.com/south-beach/south-beach-scrunch-exaggerated-bikini-set-in-orange/grp/203937?colourwayid=60424450&cid=27428#22770569",
    // },
    // {
    //   storeName: "Asos",
    //   linkToBuy:
    //     "https://www.asos.com/asos-design/asos-design-textured-beach-shorts-and-shirt-in-white/grp/33061?colourwayid=60306022&cid=2238#21876229",
    // },
    // {
    //   storeName: "Asos",
    //   linkToBuy:
    //     "https://www.asos.com/reclaimed-vintage/reclaimed-vintage-inspired-recycled-underwired-bikini-top-in-snake-print/prd/23193742?colourwayid=60458087&cid=2238",
    // },
  ];

  const [items, setItems] = useState(exc);

  const i = {
    storeName: "Asos",
    linkToBuy:
      "https://www.asos.com/south-beach/south-beach-scrunch-exaggerated-bikini-set-in-orange/grp/203937?colourwayid=60424450&cid=27428#22770569",
  };

  useEffect(() => {
    getItems({
      gender: "women",
      category: "Clothing",
      productType: "Tops",
      colors: ["Black"],
      sizes: ["S"],
    }).then(setItems);
  }, []);

  function getItems(query) {
    console.log(query);
    return axios({
      method: "POST",
      url: "http://localhost:8080/api/filter",
      data: {
        query: query,
      },
    })
      .then(console.log)
      .catch(console.log);
  }

  return (
    <div className="App">
      <h1>DressApp</h1>
      <FilterPannel getItems={getItems} />
      {/* {items.map((item) => {
        return <Item item={item} />;
      })} */}
      {/* <Item item={i} /> */}
    </div>
  );
}

export default App;
