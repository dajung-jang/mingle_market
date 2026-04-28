import { create } from "zustand";
import { supabase } from "../supabaseClient";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api"

export const useUserStore = create((set) => ({
  currentUser: null,

  // 회원가입
  signUp: async (email, password, nickname) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // user 테이블에 닉네임 저장
    await axios.post(`${BASE_URL}/users`, {
      id: data.user.id,
      nickname,
    });

    set({ currentUser: { ...data.user, nickname } });
  },

  // 로그인
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }); 
    if (error) throw error;

    // 닉네임 불러오기
    const res = await axios.get(`${BASE_URL}/users/${data.user.id}`);
    set({ currentUser: { ...data.user, nickname:res.data.nickname } });
  },

  // 로그아웃
  signOut: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null });
  },

  // 로그인 유지(새로고침했을떄)
  loadUser: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return;

    const res = await axios.get(`${BASE_URL}/users/${data.session.user.id}`);
    set({ currentUser: { ...data.session.user, nickname: res.data.nickname } });
  },
}));