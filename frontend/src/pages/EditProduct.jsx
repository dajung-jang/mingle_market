import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect, useState } from "react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct } = useProductStore();

  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setTitle(data.title);
        setPrice(data.price);
        setLocation(data.location);
        setImage(data.image);
      });
  }, [id]);

  const handleUpdate = async () => {
    await updateProduct(id, {
      ...product,
      title,
      price: Number(price),
      location,
      image,
    });
    navigate(`/product/${id}`);
  };

  if (!product) return <div className="p-5">로딩중...</div>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        상품 수정
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-3"
        placeholder="상품명"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        className="w-full border p-2 mb-3"
        placeholder="금액"
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
        placeholder="이미지 URL"
        className="w-full border p-2 mb-3 rounded"
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