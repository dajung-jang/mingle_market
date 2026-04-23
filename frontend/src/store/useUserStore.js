import { create } from "zustand";
import { supabase } from "../supabaseClient";

export const useUserStore = create((set) => ({
  currentUser: null,

  // 회원가입
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    set({ currentUser: data.user })
  },

  // 로그인
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }) 
    if (error) throw error
    set({ currentUser: data.user })
  },

  // 로그아웃
  signOut: async () => {
    await supabase.auth.signOut()
    set({ currentUser: null })
  },

  // 로그인 유지(새로고침했을떄)
  loadUser: async () => {
    const { data } = await supabase.auth.getSession()
    set({ currentUser: data.session?.user ?? null })
  },
}));