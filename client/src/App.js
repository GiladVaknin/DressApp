import "./styles/app.css";
import Item from "./components/Item";
import FilterPannel from "./components/FilterPannel";

import { useState, useEffect, useRef } from "react";
const axios = require("axios");

function App() {
  const items = useRef([]);
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
        items.current = res.data;
        loadItems([]);
      })
      .catch(console.log);
  }

  function loadItems(oldItems) {
    const { length } = items.current;
    if (!length) return;

    const newItems = oldItems.slice();
    if (length <= 10) {
      for (let i = 0; i < length; i++) {
        newItems.push(items.current.pop());
      }
    } else {
      for (let i = 0; i < 9; i++) {
        newItems.push(items.current.pop());
      }
    }

    setShownItems(newItems);
    cachePreviews();
  }

  function cachePreviews() {
    axios({
      method: "POST",
      url: "http://localhost:8080/api/cachepreviews",
      data: {
        query: items.current.slice(0, 10),
      },
    });
  }

  function getRecent() {
    return axios({
      method: "GET",
      url: "http://localhost:8080/api/recent",
    }).then((res) => res.data);
  }

  useEffect(() => {
    getRecent()
      .then((res) => setShownItems(res))
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
      {items.current.length ? (
        <button onClick={() => loadItems(shownItems)}>LOAD MORE</button>
      ) : null}
    </div>
  );
}

export default App;
