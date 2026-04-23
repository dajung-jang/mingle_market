import React from "react";
// import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";

const Home = () => {

  const { products, fetchProducts } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="bg-blue-50 rounded-2xl p-10 mb-8 text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">
          믿을 수 있는 중고거래
        </h2>
        <p className="text-gray-500">
          MingleMarket 에서 내 주변 중고 상품을 찾아보세요
        </p>
      </div>

      {/* 상품목록 */}
      <h3 className="text-lg font-bold mb-4">최근 등록된 상품</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
    // <div className="p-5">
    //   <div className="flex justify-between mb-4">
    //     <h2 className="text-xl font-bold mb-4">중고 상품</h2>

    //     <button
    //       onClick={() => navigate("/add")}
    //       className="bg-blue-500 text-white px-3 py-1 rounded"
    //     >
    //         상품 등록
    //     </button>
    //     <button
    //       onClick={() => navigate("/mypage")}
    //       className="text-sm bg-black text-white px-3 py-1 rounded"
    //     >
    //       찜 목록
    //     </button>
    //     <button
    //       onClick={() => navigate("/chat")}
    //       className="bg-blue-500 text-white px-3 py-1 rounded"
    //     >
    //       채팅목록
    //     </button>
    //   </div>

    //   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    //     {products.map((item) => (
    //     <ProductCard key={item.id} product={item} />
    //     ))}
    //   </div>
    // </div>
  );
};

export default Home;