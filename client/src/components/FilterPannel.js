import React, { useRef, useState } from "react";
import MultipleSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";

function FilterMenu(props) {
  const query = useRef({
    gender: null,
    type: null,
    sizes: [],
    colors: [],
  });

  const [gender, setGender] = useState("");

  function renderGender() {
    setGender(query.current.gender);
  }

  const colors = [
    "Black",
    "Blue",
    "Brown",
    "Green",
    "Grey",
    "Multi",
    "Navy",
    "Neutral",
    "Pink",
    "Purple",
    "Red",
    "White",
    "Yellow",
  ];

  const sizes = ["S", "M", "L", "XS", "XL"];

  const menProductsTypes = [
    "Co-ords",
    "Jeans",
    "Shirts",
    "Shorts",
    "Swimwear",
    "Polo shirts",
    "Activewear",
    "Designer",
    "Hoodies & Sweatshirts",
    "Jackets & Coats",
    "Joggers",
    "Jumpers & Cardigans",
    "Underwear",
    "Multipacks",
  ];

  const womenProductsTypes = [
    "Co-ords",
    "Jeans",
    "Shorts",
    "Activewear",
    "Hoodies & Sweatshirts",
    "Coats & Jackets",
    "Jumpers & Cardigans",
    "Lingerie & Nightwear",
    "Skirts",
    "Swimwear & Beachwear",
    "Tops",
  ];

  const getItems = props.getItems;

  return (
    <div id="filterPanel">
      <SingleSelect
        ref={query}
        selectName="GENDER"
        options={["men", "women"]}
        renderParent={renderGender}
      />

      <SingleSelect
        ref={query}
        selectName="TYPE"
        options={
          query.current.gender
            ? query.current.gender === "men"
              ? menProductsTypes
              : womenProductsTypes
            : []
        }
      />
      <MultipleSelect ref={query} selectName="SIZE" options={sizes} />
      <MultipleSelect ref={query} selectName="COLOR" options={colors} />
      <button
        onClick={() =>
          getItems({
            gender: query.current.gender,
            category: "Clothing",
            productType: query.current.type,
            colors: query.current.colors,
            sizes: query.current.sizes,
          })
        }
      >
        Search
      </button>
    </div>
  );
}

export default FilterMenu;
