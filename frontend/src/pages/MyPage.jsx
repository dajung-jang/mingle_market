import { useLikeStore } from "../store/useLikeStore";
import ProductCard from "../components/ProductCard";

const MyPage = () => {
  const { likedItems } = useLikeStore();

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        ❤️ 찜한 상품  
      </h2> 

      {likedItems.length === 0 ? (
        <p className="text-gray-400">
          찜한 상품이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 
        gap-4">
          {likedItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPage;