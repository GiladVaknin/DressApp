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
  //  const item = getPreview(props.item);

  return (
    item && (
      <div>
        <img src={item.imgSrc} alt={item.title} />
        <h2>{item.title}</h2>
        <span>
          <h3>{item.price}</h3>
          <h3>{item.prevPrice}</h3>
          <h3>{item.discountPercent}</h3>
        </span>
        <h2>{item.linkToBuy}</h2>
      </div>
    )
  );
}

export default Item;
