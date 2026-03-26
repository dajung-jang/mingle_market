import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useLikeStore } from "../store/useLikeStore";

const Detail = () => {
  const userId = "user1"; // 로그인 기능 전 더미 유저 정보
  const { id } = useParams();
  const navigate = useNavigate();
  const { likedItems, toggleLike } = useLikeStore();
  
  // 상품 찾기
  const product = products.find(
    (item) => item.id === Number(id)
  );
  
  // 상품 없을때
    if (!product) return <div className="p-5">상품 없음</div>;

    // 찜 여부 확인
  const isLiked = likedItems.some(
    (item) => item.id === product.id
  );


  return (
    <div className="p-5">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500"
      >
        ← 뒤로가기
      </button>

      {/* 제품 이미지 */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-72 object-cover rounded-xl"
      />

      {/* 제품 정보 */}
      <div className="mt-4 text-left">
        <h2 className="text-xl font-bold">{product.title}</h2>
        <p className="text-2xl font-bold mt-2">
          {product.price.toLocaleString()}원
        </p>
        <p className="text-gray-400 mt-1">
          {product.location}
        </p>

        {/* 제품 설명 */}
        <p className="mt-4">
          상태 좋아요 깨끗하게 사용했습니다~~
        </p>
      </div>

      {/* 버튼 */}
      <div className="mt-6 flex gap-2">
        <button 
          onClick={() => toggleLike(product)}
          className={`flex-1 py-3 rounded-lg ${isLiked ? "bg-red-500 text-white" : "bg-gray-200"}`}
        >
            {isLiked ? "❤️ 찜됨" : "🤍 찜하기"}
        </button>
        <button 
          onClick={() => navigate(`/chat/${product.id}/${userId}`)}
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semiblod"
        >
          채팅하기
        </button>
      </div>
    </div>
  );
};

export default Detail;