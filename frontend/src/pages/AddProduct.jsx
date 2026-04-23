import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useUserStore } from "../store/useUserStore";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProductStore();
  const { currentUser } = useUserStore();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    if (!title || !price || !location) return;

    await addProduct({
      title,
      price: Number(price),
      location,
      image: image || "https://placehold.co/150x150",
      sellerId: currentUser.id,
    });

    navigate("/");
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        상품 등록
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="상품명"
        className="w-full border p-2 mb-3"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="금액"
        type="number"
        className="w-full border p-2 mb-3"
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="거래 지역"
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="이미지 URL (선택사항)"
        className="w-full border p-2 mb-3 rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        등록하기
      </button>
    </div>
  );
};

export default AddProduct;