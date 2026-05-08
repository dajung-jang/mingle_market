import { useEffect, useState, useRef } from "react";
import { useLikeStore } from "../store/useLikeStore";
import ProductCard from "../components/ProductCard";
import { useUserStore } from "../store/useUserStore";
import { supabase } from "../supabaseClient";
import { regions } from "../data/regions";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api";

const MyPage = () => {
  const navigate = useNavigate();

  const { likedItems, fetchLikes } = useLikeStore();
  const { currentUser, updateUser } = useUserStore();
  // 유저가 등록한 상품 필터링
  const [myProducts, setMyProducts] = useState([]);

  // 수정 상태
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [saving, setSaving] = useState(false);
  // 상품 가격변동 알람
  const [alerts, setAlerts] = useState([]);

  const profileInputRef = useRef(null);

  useEffect(()=> {
    if (!currentUser) return;

    // 찜 목록 불러오기
    fetchLikes(currentUser.id);

    // 내 상품 불러오기
    axios.get(`${BASE_URL}/products`)
      .then((res) => {
        const filtered = res.data.products.filter(
          (item) => item.sellerId === currentUser.id
        );
        setMyProducts(filtered);
      });

    // 알림 목록 불러오기
    axios.get(`${BASE_URL}/alerts/${currentUser.id}`)
      .then((res) => {
        console.log(res.data); //데이터 확인용
        setAlerts(res.data);
      });
    
    // 현재 유저 정보로 초기화
    setNickname(currentUser.nickname || "");
    setProfilePreview(currentUser.profileImage || null);
    setSelectedCity(currentUser.userCity || "");
    setSelectedDistrict(currentUser.userDistrict || "");
    setSelectedDong(currentUser.userDong || "");
  }, [currentUser]);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // 가격변동 알람 읽음처리
  const handleMarkAllRead = async () => {
    await axios.put(`${BASE_URL}/alerts/read-all/${currentUser.id}`);
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let profileImageUrl = currentUser.profileImage;

      // 새 프로필 이미지 업로드
      if (profileFile) {
        const fileName = `${Date.now()}_${profileFile.name}`;
        const { error } = await supabase.storage
          .from("profile-images")
          .upload(fileName, profileFile);
        if (!error) {
          const { data: urlData } = supabase.storage
            .from("profile-images")
            .getPublicUrl(fileName);
          profileImageUrl = urlData.publicUrl;
        }
      }

      await axios.put(`${BASE_URL}/users/${currentUser.id}`, {
        nickname,
        profileImage: profileImageUrl,
        userCity: selectedCity,
        userDistrict: selectedDistrict,
        userDong: selectedDong,
      });

      updateUser({
        nickname,
        profileImage: profileImageUrl,
        userCity: selectedCity,
        userDistrict: selectedDistrict,
        userDong: selectedDong,
      });

      setIsEditing(false);
      alert("수정 완료");
    } catch (e) {
      alert("수정 중 오류가 발생했습니다.");
      console.error(e);
    }finally {
      setSaving(false);
    }
  };

  if (!currentUser) return (
    <div className="text-center mt-20 text-gray-400">
      로그인이 필요합니다.
    </div>
  );

  const distircts = selectedCity ? Object.keys(regions[selectedCity]) : [];
  const dongs = selectedCity && selectedDistrict
    ? regions[selectedCity][selectedDistrict]
    : [];

  return (
    <div>
      <div className="bg-white rounded-2xl border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">내 프로필</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-500 hover:underline"
            >
              수정하기
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-400 hover:underline"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-sm text-blue-500 hover:underline"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          {/* 프로필 이미지 */}
          <div
            onClick={() => isEditing && profileInputRef.current?.click()}
            className={`w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ${isEditing ? "cursor-pointer hover:opacity-80" : ""}`}
          >
            <img
              src={profilePreview || "http://placehold.co/80x80"}
              alt="프로필"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "http://placehold.co/80x80"; }}
            />
          </div>
          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileChange}
            className="hidden"
          />

          {/* 유저 정보 */}
          <div className="flex-1">
            {isEditing ? (
              <>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임"
                  className="w-full border p-2 mb-2 rounded"
                />
                <div className="flex gap-2">
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setSelectedDistrict("");
                      setSelectedDong("");
                    }}
                    className="flex-1 border p-2 rounded text-sm"
                  >
                    <option value="">시/도</option>
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
                    className="felx-1 border p-2 rounded text-sm disabled:bg-gray-100"
                  >
                    <option value="">구</option>
                    {distircts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    value={selectedDong}
                    onChange={(e) => setSelectedDong(e.target.value)}
                    disabled={!selectedDistrict}
                    className="felx-1 border p-2 rounded text-sm disabled:bg-gray-100"
                  >
                    <option value="">동</option>
                    {dongs.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-bold">{currentUser.nickname}</p>
                <p className="text-sm text-gray-400">{currentUser.email}</p>
                {currentUser.userCity && (
                  <p className="text-sm text-gray-400 mt-1">
                  📍 {currentUser.userCity} {currentUser.userDistrict} {currentUser.userDong}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 가격 변동 알림 */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl border p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🔔 가격 변동 알림</h2>
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-500 hover:underline"
            >
              모두 읽음
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={async () => {
                  await axios.put(`${BASE_URL}/alerts/read/${alert.id}`);
                setAlerts((prev) =>
                  prev.map((a) => a.id === alert.id ? { ...a, isRead:true} : a)
                );
                navigate(`/product/${alert.productId}`);
                }}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer ${
                  alert.isRead ? "bg-gray-50" : "bg-blue-50"
                }`}
              >
                <img
                  src={alert.productImage || "https://placehold.co/48x48"}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/48x48"; }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{alert.productTitle}</p>
                  <p className="text-sm text-gray-500">
                    <span className="line-through text-gray-400">
                      {alert.oldPrice?.toLocaleString()}원
                    </span>
                    {" → "}
                    <span className={alert.newPrice < alert.oldPrice ? "text-red-500 font-bold" : "text-blue-500 font-bold"}>
                      {alert.newPrice?.toLocaleString()}dnjs
                    </span>
                    {alert.newPrice < alert.oldPrice ? " 🔽 가격 인하" : " 🔼 가격 인상"}
                  </p>
                </div>
                {!alert.isRead && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 내 상품 */}
      <h2 className="text-xl font-bold mb-4">내 상품</h2>
      {myProducts.length === 0 ? (
        <p className="text-gray-400 mb-8">등록한 상품이 없습니다.</p>
      ) : (
        <div className="grid gird-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {myProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}

      {/* 찜 목록 */}
      <h2 className="text-xl font-bold mb-4">❤️ 찜한 상품</h2> 
      {likedItems.length === 0 ? (
        <p className="text-gray-400">찜한 상품이 없습니다.</p>
      ) : (
        <div className="grid gird-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likedItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPage;