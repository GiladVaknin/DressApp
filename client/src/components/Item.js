import React, { useState, useEffect } from "react";
const axios = require("axios");

function Item(props) {
  const [item, setItem] = useState(props.item);

  useEffect(() => {
    getPreview(props.item).then((res) => setItem(res));
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
          <h3 className="prevPrice">{item.prevPrice} ₪</h3>
          <h3 className="discountPercent">-{item.discountPercent} %</h3>
        </>
      );
    else return;
  }

  return item ? (
    <div class="item">
      <img src={item.imgSrc} alt={item.title} />
      <h2 className="itemTitle">{item.title}</h2>
      <span className="priceDetails">
        <h3 className="price">{item.price} ₪</h3>
        {getPrevPrice()}
      </span>
      <h2>
        <a href={item.linkToBuy}>Shop Now!</a>
      </h2>
    </div>
  ) : null;
}

export default Item;
