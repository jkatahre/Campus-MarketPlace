import React from "react";
import Card from "../Cards/Card";

function ProductsList({ products }) {
  return (
    <div>
      {products.map((item, index) => (
        <Card
          key={index}
          name={item.itemName}
          price={item.price}
          category={item.catagary}
        />
      ))}
    </div>
  );
}

export default ProductsList