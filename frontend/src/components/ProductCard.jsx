import { useLikeStore } from "../store/useLikeStore";
import { useUserStore } from "../store/useUserStore"; 
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { likedItems, toggleLike } = useLikeStore();
  const { currentUser } = useUserStore();

  // 현재 상품 찜 상태 확인
  const isLiked = likedItems.some(
    (item) => item.id === product.id
  );

  return (
      <div
        onClick={() => navigate(`/product/${product.id}`)} 
        className="relative cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 bg-white border"
      >
    
        {/* 찜버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (currentUser) toggleLike(product, currentUser.id);
          }}  
          className="absolute top-2 right-2 text-xl z-10"
        >
         {isLiked ? "❤️" : "🤍"}
        </button>
        
        {/* 이미지 */}
        <div className="w-full h-48 overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover hover:scale-105 transition"
            onError={(e) => {
              e.target.src = "https://placehold.co/300x200";
            }}
          />
        </div>
        {/* 내용 */}
        <div className="p-3 text-left">
          <h3 className="text-sm truncate font-semibold">
            {product.title}
          </h3>
          <p className="font-bold text-lg mt-1">
            {product.price.toLocaleString()}원
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {product.location}
          </p>
        </div>
      </div>
  );
};

export default ProductCard;