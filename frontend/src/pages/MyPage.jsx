import { useEffect, useState } from "react";
import { useLikeStore } from "../store/useLikeStore";
import ProductCard from "../components/ProductCard";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const MyPage = () => {
  const { likedItems, fetchLikes } = useLikeStore();
  const { currentUser } = useUserStore();
  // 유저가 등록한 상품 필터링
  const [myProducts, setMyProducts] = useState([]);

  useEffect(()=> {
    if (!currentUser) return;

    // 찜 목록 불러오기
    fetchLikes(currentUser.id);

    // 내 상품 불러오기
    axios.get(`${BASE_URL}/products`)
      .then((res) => {
        const filtered = res.data.filter(
          (item) => item.sellerId === currentUser.id
        );
        setMyProducts(filtered);
      });
  }, [currentUser]);

  if (!currentUser) return (
    <div className="text-center mt-20 text-gray-400">
      로그인이 필요합니다.
    </div>
  );

  return (
    <div>
      {/* 내 상품 */}
      <h2 className="text-xl font-bold mb-4">내 상품</h2>
      {myProducts.length === 0 ? (
        <p className="text-gray-400 mb-8">등록한 상품이 없습니다.</p>
      ) : (
        <div className="grid gird-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {myProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}

      {/* 찜 목록 */}
      <h2 className="text-xl font-bold mb-4">❤️ 찜한 상품</h2> 
      {likedItems.length === 0 ? (
        <p className="text-gray-400">찜한 상품이 없습니다.</p>
      ) : (
        <div className="grid gird-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likedItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPage;