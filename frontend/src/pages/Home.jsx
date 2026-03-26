import React from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();
  return (
    <div className="p-5">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold mb-4">중고 상품</h2>

        <button
          onClick={() => navigate("/mypage")}
          className="text-sm bg-black text-white px-3 py-1 rounded"
        >
          찜 목록
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((item) => (
        <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;