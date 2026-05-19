import { create } from "zustand";
import { supabase } from "../supabaseClient";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api"

export const useUserStore = create((set) => ({
  currentUser: null,

  // 회원가입
  signUp: async (email, password, userInfo) => {
    // 1.회원가입
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // 2. 바로 로그인 해서 세션 획득
    const {data: signInData} = await supabase.auth.signInWithPassword({ email, password });

    let profileImageUrl = null;
    // 3. 프로필 이미지 업로드
    if(userInfo.profileFile) {
      const fileName = `${Date.now()}_${userInfo.profileFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, userInfo.profileFile);
      if(!uploadError) {
        const {data: urlData} = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);
        profileImageUrl = urlData.publicUrl;
      }
    }

    // user 테이블에 유저 정보 저장
    await axios.post(`${BASE_URL}/users`, {
      id: data.user.id,
      nickname: userInfo.nickname,
      profileImage: profileImageUrl,
      userCity: userInfo.userCity,
      userDistrict: userInfo.userDistrict,
      userDong: userInfo.userDong,
    });

    set({ currentUser: { ...signInData.user, ...userInfo, profileImage: profileImageUrl } });
  },

  // 로그인
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }); 
    if (error) throw error;

    // 닉네임 불러오기
    const res = await axios.get(`${BASE_URL}/users/${data.user.id}`);
    set({ currentUser: { 
      ...data.user, 
      nickname:res.data.nickname,
      profileImage: res.data.profileImage,
      userCity: res.data.userCity,
      userDistrict: res.data.userDistrict,
      userDong: res.data.userDong,
    }});
  },

  // 로그인 유지(새로고침했을떄)
  loadUser: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return;

    const res = await axios.get(`${BASE_URL}/users/${data.session.user.id}`);
    set({ currentUser: { 
      ...data.session.user, 
      nickname: res.data.nickname,
      profileImage: res.data.profileImage,
      userCity: res.data.userCity,
      userDistrict: res.data.userDistrict,
      userDong: res.data.userDong,
    }});
  },

  // 유저 정보 수정 업데이트
  updateUser: (userInfo) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...userInfo }
    }));
  },

  // 로그아웃
  signOut: async () => {
    await supabase.auth.signOut();
    //로그아웃시 유저 지역 정보 초기화
    localStorage.removeItem("regionInitialized");
    localStorage.removeItem("selectedCity");
    localStorage.removeItem("selectedDistrict"); 
    set({ currentUser: null });
  }, 
}));