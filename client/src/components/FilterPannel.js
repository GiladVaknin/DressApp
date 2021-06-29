import React from "react";

function FilterMenu(props) {
  return (
    <div>
      <select name="gender">
        <option value="men">men</option>
        <option value="women">women</option>
      </select>
      <select name="type">
        <option value="Co-ords">Co-ords</option>
        <option value="Jeans">Jeans</option>
        <option value="Shirts">Shirts</option>
        <option value="Shorts">Shorts</option>
        <option value="Swimwear">Swimwear</option>
        <option value="Polo shirts">Polo shirts</option>
      </select>
      <select name="size">
        <option value="XS">XS</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>
      <select name="color">
        <option value="Black">Black</option>
        <option value="Blue">Blue</option>
        <option value="Brown">Brown</option>
        <option value="Green">Green</option>
        <option value="Grey">Grey</option>
        <option value="Multi">Multi</option>
        <option value="Navy">Navy</option>
        <option value="Neutral">Neutral</option>
        <option value="Pink">Pink</option>
        <option value="Purple">Purple</option>
        <option value="Red">Red</option>
        <option value="White">White</option>
        <option value="Yellow">Yellow</option>
      </select>
    </div>
  );
}

export default FilterMenu;
