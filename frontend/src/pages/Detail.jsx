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
  const { deleteProduct } = useProductStore();

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
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-500 hover:text-blue-500"
      >
        ← 뒤로가기
      </button>

      {/* 2단 레이아웃 */}
      <div className="flex flex-col md:flex-row gap-10">

        {/* 왼쪽 - 이미지 */}
        <div className="w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-96 object-cover rounded-2xl bg-gray-100"
            onError={(e) => { e.target.src = "https://placehold.co/600x400"; }}
          />
        </div>

        {/* 오른쪽 - 정보 */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-3">{product.title}</h2>
            <p className="text-3xl font-bold text-blue-600 mb-3">
              {product.price.toLocaleString()}원
            </p>
            <p className="text-gray-400 mb-6">📍 {product.location}</p>
            <p className="text-gray-600 leading-relaxed">
              상태 좋아요 깨끗하게 사용했습니다~~
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-8 flex flex-col gap-3">
              {isSeller ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/edit/${product.id}`)}
                    className="flex-1 bg-gray-100 py-3 rounded-xl font-semibold hover:bg-gray-200"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600"
                  >
                    삭제하기
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        alert("로그인이 필요합니다.");
                        return;
                      }
                      toggleLike(product);
                    }}
                    className={`flex-1 py-3 rounded-xl font-semibold ${
                      isLiked
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {isLiked ? "❤️ 찜됨" : "🤍 찜하기"}
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        alert("로그인이 필요합니다.");
                        return;
                      }
                      navigate(`/chat/${product.id}/${currentUser.id}/${product.sellerId}`);
                    }}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600"
                  >
                    채팅하기
                  </button>
                </div>
              )}
            {/* <div className="flex gap-3">
              <button
                onClick={() => toggleLike(product)}
                className={`flex-1 py-3 rounded-xl font-semibold ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {isLiked ? "❤️ 찜됨" : "🤍 찜하기"}
              </button>
              {isSeller ? (
                <button className="flex-1 bg-gray-100 py-3 rounded-xl text-gray-400 font-semibold">
                  내 상품입니다
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate(`/chat/${product.id}/${currentUser.id}/${product.sellerId}`)
                  }
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600"
                >
                  채팅하기
                </button>
              )}
            </div>

            {isSeller && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/edit/${product.id}`)}
                  className="flex-1 bg-gray-100 py-3 rounded-xl font-semibold hover:bg-gray-200"
                >
                  수정하기
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600"
                >
                  삭제하기
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;