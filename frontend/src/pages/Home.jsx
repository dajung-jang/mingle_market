import React from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const Home = () => {
  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">중고 상품</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((item) => (
        <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;