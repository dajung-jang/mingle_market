import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLikeStore } from "../store/useLikeStore";
import { useUserStore } from "../store/useUserStore";
import { useProductStore } from "../store/useProductStore";

const Detail = () => {
  // const userId = "user1"; // 로그인 기능 전 더미 유저 정보
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { likedItems, toggleLike } = useLikeStore();
  const { deleteProduct, updateProduct } = useProductStore();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 상품 아이디로 조회
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

    // 상품 없을때
  if (!product) return <div className="p-5">로딩중...</div>;

  // 판매자인지 구매자인지 확인
  const isSeller = currentUser?.id === product.sellerId;  

    // 찜 여부 확인
  const isLiked = likedItems.some(
    (item) => item.id === product.id
  );

  const handleDelete = async () => {
    await deleteProduct(product.id);
    navigate("/");
  };

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
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <button 
            onClick={() => toggleLike(product)}
            className={`flex-1 py-3 rounded-lg ${isLiked ? "bg-red-500 text-white" : "bg-gray-200"}`}
          >
              {isLiked ? "❤️ 찜됨" : "🤍 찜하기"}
          </button>

          {isSeller ? (
            <button className="flex-1 bg-gray-300 py-3 rounded-lg">
              내 상품입니다.
            </button>
          ) : (
            <button
              onClick={() => 
                navigate(
                  `/chat/${product.id}/${currnetUser.id}/${product.sellerId}`
                )
              }
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semiblod"
            >
              채팅하기
            </button>
          )} 
        </div>
        
        {isSeller && (
          <button 
            onClick={handleDelete}
            className="w-full gb-red-500 text-white py-3 rounded-lg mt-3"
          >
            삭제하기
          </button>
        )}

        {isSeller && (
          <button
            onClick={() => navigate(`/edit/${product.id}`)}
            className="w-full bg-gray-300 py-3 rounded-lg"
          >
            수정하기
          </button>
        )}

      </div>
    </div>
  );
};

export default Detail;