import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { regions } from "../data/regions"
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct } = useProductStore();

  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // 등록된 이미지
  const [existingImages, setExistingImages] = useState([]);

  // 새로 등록 이미지
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  // 지역
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // 상품 정보
    fetch(`${BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setTitle(data.title);
        setPrice(data.price);
        setDescription(data.description || "");

        // 지역 정보 불러오기
        const parts = data.location?.split(" ");
        if (parts?.length >= 3) {
          setSelectedCity(parts[0]);
          setSelectedDistrict(parts[1]);
          setSelectedDong(parts[2]);
        }
      });

      // 등록된 이미지
      axios.get(`${BASE_URL}/products/${id}/images`)
        .then((res) => setExistingImages(res.data));
  }, [id]);

  // 새 이미지 추가
  const handleImageChange = (e)  => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newImageFiles.length + files.length;
    if (total > 5) {
      alert("이미지는 최대 5개까지 등록 가능해요.");
      return;
    }
    setNewImageFiles((prev) => [...prev, ...files]);
    const newPrev = files.map((file) => URL.createObjectURL(file));
    setNewPreviews((prev) => [...prev, ...newPrev]);
  };

  // 기존 등록된 이미지 삭제
  const handleRemoveExiting = (index) => {
    setExistingImages((prev) => prev.filter((_, i ) => i !== index));
  };

  // 새로 등록한 이미지 삭제
  const handleRemoveNew = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!title || !price || !selectedCity || !selectedDistrict || !selectedDong) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setUploading(true);

    try {
      // 새이미지 업로드
      const newImageUrls = [];
      for (const file of newImageFiles) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);
        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        newImageUrls.push(urlData.publicUrl);
      }

      const location = `${selectedCity} ${selectedDistrict} ${selectedDong}`;

      // 기존 이미지 url, 새 이미지 url 합치기
      const allImageUrls = [
        ...existingImages.map((img) => img.imageUrl),
        ...newImageUrls,
      ];

      await updateProduct(id, {
        ...product,
        title,
        price: Number(price),
        location,
        description,
        imgae: allImageUrls[0] || "https://placehold.co/300x200",
        imgaeUrls: allImageUrls,
      });

      navigate(`/product/${id}`);
    } catch (e) {
      alert("수정 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  if (!product) return <div className="p-5">로딩중...</div>;

  const districts = selectedCity ? Object.keys(regions[selectedCity]) : [];
  const dongs = selectedCity && selectedDistrict
    ? regions[selectedCity][selectedDistrict]
    : [];

  const totalImages = existingImages.length + newImageFiles.length;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-blod mb-6">상품 수정</h2>

      {/* 이미지 */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap mb-2">
          {/* 기존 이미지 */}
          {existingImages.map((img, index) => (
            <div key={img.id} className="relative w-24 h-24">
              <img 
                src={img.imageUrl}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => { e.target.src = "https://placehold.co/96x96"; }}
              />
              <button
                onClick={() => handleRemoveExiting(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                x
              </button>
            </div>
          ))}

          {/* 새 이미지 미리보기 */}
          {newPreviews.map((src, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={src}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveNew(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}

          {/* 추가버튼 */}
          {totalImages < 5 && (
            <div
              onClick={() => document.getElementById("editImageInput").click()}
              className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
            >
              <span className="text-gray-400 text-3xl">+</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400">최대 5장까지 등록 가능합니다.</p>
        <input
          id="editImageInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="상품명"
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        placeholder="금액"
        className="w-full border p-2 mb-3 rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="상품 설명을 입력해주세요"
        rows={4}
        className="w-full border p-2 mb-3 rounded resize-none"
      />

      <div className="flex gap-2 mb-3">
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedDistrict("");
            setSelectedDong("");
          }}
          className="flex-1 border p-2 rounded"
        >
          <option value="">시/도 선택</option>
          {Object.keys(regions).map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedDong("");
          }}
          disabled={!selectedCity}
          className="flex-1 border p-2 rounded disabled:bg-gray-100"
        >
          <option value="">구 선택</option>
          {districts.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>

        <select
          value={selectedDong}
          onChange={(e) => {setSelectedDong(e.target.value);}}
          disabled={!selectedDistrict}
          className="flex-1 border p-2 rounded disabled:bg-gray-100"
        >
          <option value="">동 선택</option>
          {dongs.map((dong) => (
            <option key={dong} value={dong}>{dong}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={uploading}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-300"
      >
        {uploading ? "수정 중..." : "수정하기"}
      </button>
    </div>
  );
};

export default EditProduct;