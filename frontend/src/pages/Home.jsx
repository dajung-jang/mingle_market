import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { useProductStore } from "../store/useProductStore";
import { useLikeStore } from "../store/useLikeStore";
import { useUserStore } from "../store/useUserStore";
import { useEffect, useState } from "react";
import { categories } from "../data/categories";
import { regions } from "../data/regions";

const Home = () => {

  const [loading, setLoading] = useState(false);
  // 새로고침 시 지역구 재로딩 방지
  const [initialized, setInitialized] = useState(() => {
    return localStorage.getItem("regionInitialized") === "true";
  });

  const { products, totalPages, currentPage, fetchProducts } = useProductStore();
  const { fetchLikes } = useLikeStore();
  const { currentUser } = useUserStore();

  const [searchInput, setSearchInput] = useState(""); // 입력값
  const [search, setSearch] = useState(""); // 실제 검색어
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  // 지역별 검색
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("selectedCity") || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    localStorage.getItem("selectedDistrict") || ""
  );
  
  // 로그인 하면 본인 지역 자동 세팅
  useEffect(() => {
    if (currentUser?.userCity && !initialized) {
      const city = currentUser.userCity;
      const district = currentUser.userDistrict || "";
      setSelectedCity(city);
      setSelectedDistrict(district);
      localStorage.setItem("selectedCity", city);
      localStorage.setItem("selectedDistrict", district);
      setInitialized(true);
      localStorage.setItem("regionInitialized", "true");
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    fetchProducts(1).finally(() => setLoading(false));
    if (currentUser) fetchLikes(currentUser.id);
  }, [currentUser]);

  const handleSearch = () => setSearch(searchInput);

  const districts = selectedCity ? Object.keys(regions[selectedCity] || {}) : [];

  // 검색+카테고리+판매상태 필터
  console.log(products[0]?.location);
  const filteredProducts = products.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "전체" || item.category === selectedCategory;
    const matchStatus = selectedStatus === "전체" || item.status === selectedStatus;
    //저장된 location 은 뒷글자 없이 '서울' 이런식으로 저장되기 때문에
    const matchCity = !selectedCity || item.location?.includes(
      selectedCity.replace("특별시", "").replace("광역시", "").replace("특별자치시", "").replace("특별자치도", "")
    );
    const matchDistrict = !selectedDistrict || item.location?.includes(selectedDistrict);
    return matchSearch && matchCategory && matchStatus && matchCity && matchDistrict;
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

      {/* 검색창, 지역선택 */}
      <div className="flex gap-2 mb-4">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="상품명으로 검색해주세요"
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:border-blue-400"
        />
        {/* 시/도 선택 */}
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedDistrict("");
            localStorage.setItem("selectedCity", e.target.value);
            localStorage.setItem("selectedDistrict", "");
          }}
          className="border rounded-xl px-3 py-2 outline-none focus:border-blue-400 text-sm"
        >
          <option value="">전체 지역</option>
          {Object.keys(regions).map((city) => (
            <option key={city} value={city}>
              {city.replace("특별시", "").replace("광역시", "").replace("특별자치시", "").replace("특별자치도", "").replace("도", "")}
            </option>
          ))}
        </select>
        {/* 구/군 선택 */}
        {selectedCity && (
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              localStorage.setItem("selectedDistrict", e.target.value);
            }}
            className="border rounded-xl px-3 py-2 outline-none focus:border-blue-400 text-sm"
          >
            <option value="">전체 구/군</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        )}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-2xl text-white px-5 py-3 rounded-xl hover:bg-blue-600"
        >
          🔍
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
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

        {/* 판매 상태 필터 */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-xl px-4 py-2 outline-none focus:border-blue-400 text-sm flex-shring-0"
        >
          <option value="전체">판매 상태</option>
          <option value="판매중">판매중</option>
          <option value="예약중">예약중</option>
          <option value="판매완료">판매완료</option>
        </select>
      </div>

      {/* 상품목록 */}
      <h3 className="text-lg font-bold mb-4">
        {selectedCity ? `${selectedCity} ${selectedDistrict}` : "전체 지역"}
        {selectedCategory !== "전체" && ` · ${selectedCategory}`}
        {search && ` · "${search}" 검색 결과`}
      </h3>

      {loading ? (
        <Spinner />
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 md:gird-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => fetchProducts(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={()=> fetchProducts(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => fetchProducts(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            다음
          </button>
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