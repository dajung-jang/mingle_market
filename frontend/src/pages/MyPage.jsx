import { useLikeStore } from "../store/useLikeStore";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/useProductStore";
import { useUserStore } from "../store/useUserStore";

const MyPage = () => {
  const { likedItems } = useLikeStore();
  const { products } = useProductStore();
  const { currnetUser } = useUserStore();

  // 유저가 등록한 상품 필터링
  const myProducts = products.filter(
    (item) => item.sellerId === currnetUser.id
  );

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        ❤️ 찜한 상품  
      </h2> 
      <h2 className="text-xl font-bold mb-4">
        내 상품
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

      {myProducts.length === 0 ? (
        <p className="text-gray-400">
          등록한 상품이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 md-grid-cols-3 gap-2">
          {myProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPage;