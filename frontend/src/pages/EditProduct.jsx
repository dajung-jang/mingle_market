import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useState } from "react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProductStore();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [title, setTitle] = useState(product?.title || "");
  const [price, setPrice] = useState(product?.price || "");

  const handleUpdate = () => {
    updateProduct({
      ...product,
      title,
      price: Number(price),
    });

    navigate(`/product/${id}`);
  };

  if (!product) return <div>상품 없음</div>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        상품 수정
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-3"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        className="w-full border p-2 mb-3"
      />

      <button
        onClick={handleUpdate}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        수정
      </button>
    </div>
  );
};

export default EditProduct;