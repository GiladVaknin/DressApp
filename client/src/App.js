import "./styles/app.css";
import Item from "./components/Item";
import FilterPannel from "./components/FilterPannel";

import { useState, useEffect } from "react";
const axios = require("axios");

function App() {
  const [items, setItems] = useState([]);
  const [shownItems, setShownItems] = useState([]);

  function getItems(query) {
    return axios({
      method: "POST",
      url: "http://localhost:8080/api/filter",
      data: {
        query: query,
      },
    })
      .then((res) => {
        const allItems = res.data;
        setItems(allItems);
        setShownItems([]);
        loadItems();
      })
      .catch(console.log);
  }

  function loadItems() {
    if (!items[0]) return;
    if (items.length <= 10) {
      let newItems = shownItems.slice();
      const { length } = items;
      for (let i = 0; i < length; i++) {
        newItems.push(items.pop());
      }
      setShownItems(newItems);
      cachePreviews();
    } else {
      let newItems = shownItems.slice();
      console.log(items.length);
      for (let i = 0; i < 9; i++) {
        newItems.push(items.pop());
      }
      setShownItems(newItems);
      cachePreviews();
    }
  }

  function cachePreviews() {
    axios({
      method: "POST",
      url: "http://localhost:8080/api/cachepreviews",
      data: {
        query: items.slice(0, 10),
      },
    });
  }

  function getRecent() {
    return axios({
      method: "GET",
      url: "http://localhost:8080/api/recent",
    });
  }

  useEffect(() => {
    getRecent()
      .then((res) => setShownItems(res.data))
      .catch(console.log);
  }, []);

  return (
    <div className="App">
      <div id="header"></div>
      <FilterPannel getItems={getItems} />
      <div className="items">
        {shownItems.map((item) => {
          return <Item item={item} />;
        })}
      </div>
      {items.length ? <button onClick={loadItems}>LOAD MORE</button> : null}
    </div>
  );
}

export default App;
