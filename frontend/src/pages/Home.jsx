import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/useProductStore";
import { useLikeStore } from "../store/useLikeStore";
import { useUserStore } from "../store/useUserStore";
import { useEffect, useState } from "react";
import { categories } from "../data/categories";

const Home = () => {

  const { products, fetchProducts } = useProductStore();
  const { fetchLikes } = useLikeStore();
  const { currentUser } = useUserStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  useEffect(() => {
    fetchProducts();
    if (currentUser) fetchLikes(currentUser.id);
  }, [currentUser]);

  // 검색+카테고리 필터
  const filteredProducts = products.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = 
      selectedCategory === "전체" || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

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

      {/* 검색창 */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="상품명으로 검색해주세요"
          className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-400"
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={()=> setSelectedCategory(c)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === c 
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 상품목록 */}
      <h3 className="text-lg font-bold mb-4">
        {selectedCategory === "전체" ? "최근 등록된 상품" : selectedCategory}
        {search && ` - "${search}" 검색 결과`}
      </h3>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 md:gird-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
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