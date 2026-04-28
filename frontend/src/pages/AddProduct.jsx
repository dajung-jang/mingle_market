import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useUserStore } from "../store/useUserStore";
import { supabase } from "../supabaseClient";
import { regions } from "../data/regions";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProductStore();
  const { currentUser } = useUserStore();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 지역 선택
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const [uploading, setUploading] = useState(false);

  // 이미지 여러개 선택(미리보기)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 5) {
      alert("이미지는 최대 5개까지 등록 가능합니다.");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 이미지 삭제
  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !price || !selectedCity || !selectedDistrict || !selectedDong) {
      alert("모든 항목을 입력해주세요");
      return;
    } 

    setUploading(true);

    try {
      const imageUrls = [];

      // 이미지 업로드
      for (const file of imageFiles) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error } =await supabase.storage
          .from("product-images")
          .upload(fileName, file);
        
        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        imageUrls.push(urlData.publicUrl);
      }

      const location = `${selectedCity} ${selectedDistrict} ${selectedDong}`;

      await addProduct({
        title,
        price: Number(price),
        location,
        image: imageUrls[0] || "https://placehold.co/300x200",
        imageUrls,
        sellerId: currentUser.id,
        description,
      });

      navigate("/");
    } catch (e) {
      alert("등록 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const districts = selectedCity ? Object.keys(regions[selectedCity]) : [];
  const dongs = selectedCity && selectedDistrict
    ? regions[selectedCity][selectedDistrict]
    : [];

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">상품 등록</h2>

      {/* 이미지 업로드 */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap mb-2">
          {previews.map((src, index) => (
            <div key={index} className="relative w-24 h-24">
              <img 
                src={src}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}

          {previews.length < 5 && (
            <div
              onClick={() => document.getElementById("imageInput").click()}
              className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
            >
              <span className="text-gray-400 text-3xl">+</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400">최대 5장까지 등록 가능합니다.</p>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      
      {/* 상품 이름 */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="상품명"
        className="w-full border p-2 mb-3 rounded"
      />

      {/* 가격 */}
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="금액"
        type="number"
        className="w-full border p-2 mb-3 rounded"
      />

      {/* 상품 설명 */}
      <textarea 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="상품 설명을 입력해주세요"
        rows={4}
        className="w-full border p-2 mb-3 rounded resize-none"
      />

      {/* 지역 선택 */}
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
          onChange={(e) => setSelectedDong(e.target.value)}
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
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-300"
      >
        {uploading ? "등록 중..." : "등록하기"}
      </button>
    </div>
  );
};

export default AddProduct;