import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { supabase } from "../supabaseClient";
import { regions } from "../data/regions";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isSignUp) {
        if (!nickname) return setError("닉네임을 입력해주세요.");

        // // 1.회원가입 먼저
        // const { data, error } = await supabase.auth.signUp({ email, password });
        // if (error) throw error;

        // // 2.로그인해서 세션 획득
        // const {data: signInData} = await supabase.auth.signInWithPassword({ email, password });

        // let profileImageUrl = null;

        // // 3.세션 있으면 프로필 이미지 업로드
        // if (profileFile && signInData?.session) {
        //   const fileName = `${Date.now()}_${profileFile.name}`;
        //   const { error: uploadError } = await supabase.storage
        //     .from("profile-images")
        //     .update(fileName, profileFile);
        //   if (uploadError) throw uploadError;

        //   const { data:urlData } = supabase.storage
        //     .from("profile-images")
        //     .getPublicUrl(fileName);
        //   profileImageUrl = urlData.publicUrl;
        // }

        await signUp(email, password, {
          nickname,
          profileFile,
          userCity: selectedCity,
          userDistrict: selectedDistrict,
          userDong: selectedDong,
        });
        alert("회원가입 완료! 이메일 인증 후 로그인해주세요.");
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        navigate("/");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const districts = selectedCity ? Object.keys(regions[selectedCity]) : [];
  const dongs = selectedCity && selectedDistrict
    ? regions[selectedCity][selectedDistrict]
    : [];

  return (
    <div className="p-5 max-w-sm mx-auto mt-20">
      <h2 className="text-xl font-bold mb-6">
        {isSignUp ? "회원가입" : "로그인"}
      </h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        type="email"
        className="w-full border p-2 mb-3 rounded"
      />
      
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        type="password"
        className="w-full border p-2 mb-3 rounded"
      />

      {isSignUp && (
        <>
        {/* 프로필 이미지 */}
          <div className="flex items-center gap-4 mb-3">
            <div
              onClick={() => document.getElementById("profileInput").click()}
              className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
            >
              {profilePreview ? (
                <img src={profilePreview} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-2xl">+</span>
              )}
            </div>
            <p className="text-sm text-gray-400">프로필 사진 등록 (선택)</p>
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              className="hidden"
            />
          </div>

          {/* 닉네임 */}
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="w-full border p-2 mb-3 rounded"
          />

          {/* 지역 선택 */}
          <p className="text-sm text-gray-500 mb-2">거주 지역</p>
          <div className="flex gap-2 mb-3">
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
              className="flex-1 border p-2 rounded text-sm disabled:bg-gray-100"
            >
              <option value="">구</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={selectedDong}
              onChange={(e) => setSelectedDong(e.target.value)}
              disabled={!selectedDistrict}
              className="flex-1 border p-2 rounded text-sm disabled:bg-gray-100"
            >
              <option value="">동</option>
              {dongs.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>  
          </div>
        </>
      )}
      
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded mb-3 disabled:bg-gray-300"
      >
        {loading ? "처리 중..." : isSignUp ? "가입하기" : "로그인"}
      </button>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full text-sm text-gray-500"
      >
        {isSignUp ? "이미 계정이 있어요 -> 로그인" : "계정이 없어요 -> 회원가입"}
      </button>
    </div>
  );
};

export default Login;