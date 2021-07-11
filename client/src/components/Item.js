import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Rank from "./Rank";
import { useSwipeable } from "react-swipeable";
const axios = require("axios");

function Item(props) {
  const [item, setItem] = useState(props.item);
  const [mobileDetails, setMobileDetails] = useState("");

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      setMobileDetails(" mobileDetails");
    },
    onSwipedRight: (eventData) => {
      setMobileDetails("");
    },
  });

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
          <h3 className="prevPrice">{item.prevPrice} ILS</h3>
          <h3 className="price">{item.price}&nbsp;ILS</h3>
          <h3 className="discountPercent">-{item.discountPercent} %</h3>
        </>
      );
    else
      return (
        <h3 className="price">
          {item.price ? item.price + " ILS" : "Click for price details!"}
        </h3>
      );
  }

  return (
    <a
      href={item?.linkToBuy}
      target="_blank"
      rel="noreferrer"
      className={`item${mobileDetails}`}
      style={{ backgroundImage: `url(${item?.imgSrc})` }}
      {...handlers}
    >
      {item?.imgSrc ? (
        <>
          {/* <img src={item.imgSrc} alt={item.title} /> */}
          <span className="itemTitle">{item.title}</span>
          <span className="priceDetails">{getPrice()}</span>
          <span>
            <a href={item.linkToBuy} rel="noreferrer" target="_blank">
              Buy at {item.storeName}
            </a>
          </span>
          {item.rank ? <Rank rank={item.rank} /> : null}
          <div id="mobileToolTip">
            {mobileDetails.length ? (
              <>
                Swipe right to close details{" "}
                <i className="fas fa-angle-double-right"></i>
              </>
            ) : (
              <>
                <i className="fas fa-angle-double-left"></i> Swipe left for
                details
              </>
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </a>
  );
}

export default Item;
