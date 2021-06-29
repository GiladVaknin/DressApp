import logo from "./logo.svg";
import "./App.css";
import Item from "./components/Item";
function App() {
  const item = {
    storeName: "Asos",
    linkToBuy:
      "https://www.asos.com/missguided/missguided-tie-neck-bikini-co-ord-in-rust/grp/39294?cid=2238",
  };
  return (
    <div className="App">
      <Item item={item} />
    </div>
  );
}

export default App;
