import React, { useState, useEffect } from "react";
const axios = require("axios");

function Item(props) {
  const [item, setItem] = useState({
    storeName: "Shein",
    linkToBuy:
      "https://il.shein.com/Super-Push-Up-Bra-p-2103081-cat-2203.html?scici=navbar_WomenHomePage~~tab01navbar05menu10~~5_10~~real_2195~~~~0",
    imgSrc:
      "https://img.ltwebstatic.com/images3_pi/2021/03/01/16145639018f15912591e23dc43852b712822cce9c_thumbnail_220x293.webp",
    title: "Super Push Up Bra",
    price: 19,
    prevPrice: 15,
    discountPercent: 25,
    rank: 4.7,
  });

  //   useEffect(() => {
  //     getPreview(props.item).then((res) => setItem(res));
  //   }, [props.item]);

  //   function getPreview(item) {
  //     return axios({
  //       method: "POST",
  //       url: "http://localhost:8080/api/preview",
  //       data: {
  //         query: item,
  //       },
  //     })
  //       .then((res) => res.data)
  //       .catch(console.log);
  //   }

  function getPrevPrice() {
    if (item.prevPrice > 0)
      return (
        <>
          <h3>{item.prevPrice} ILS</h3>
          <h3>-{item.discountPercent} %</h3>
        </>
      );
    else return;
  }
  //  const item = getPreview(props.item);

  return (
    item && (
      <div class="item">
        <img src={item.imgSrc} alt={item.title} />
        <h2>{item.title}</h2>
        <span>
          <h3>{item.price} ILS</h3>
          {getPrevPrice()}
        </span>
        <h2>
          <a href={item.linkToBuy}>Shop Now!</a>
        </h2>
      </div>
    )
  );
}

export default Item;
