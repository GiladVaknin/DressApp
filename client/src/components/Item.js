import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Rank from "./Rank";
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

  function getPrice() {
    if (item.prevPrice > 0)
      return (
        <>
          <h3 className="prevPrice">{item.prevPrice} ₪</h3>
          <h3 className="price">{item.price} ₪</h3>
          <h3 className="discountPercent">-{item.discountPercent} %</h3>
        </>
      );
    else return <h3 className="price">{item.price} ₪</h3>;
  }

  return (
    <a
      href={item?.linkToBuy}
      target="_blank"
      rel="noreferrer"
      class="item"
      style={{ backgroundImage: `url(${item?.imgSrc})` }}
    >
      {item?.imgSrc ? (
        <>
          {/* <img src={item.imgSrc} alt={item.title} /> */}
          <span className="itemTitle">{item.title}</span>
          <span className="priceDetails">{getPrice()}</span>
          <span>
            <a href={item.linkToBuy}>Buy at {item.storeName}</a>
          </span>
          {item.rank ? <Rank rank={item.rank} /> : null}
        </>
      ) : (
        <Loader />
      )}
    </a>
  );
}

export default Item;
