import React, { useState, useEffect } from "react";
const axios = require("axios");

function Item(props) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    getPreview(props.item).then(setItem);
  }, [props.item]);

  function getPreview(item) {
    return axios({
      method: "POST",
      url: "http://localhost:8080/api/preview",
      data: {
        query: item,
      },
    })
      .then((res) => res.data)
      .catch(console.log);
  }

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
