import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const useLikeStore = create((set, get) => ({
  likedItems: [],

  // 찜 목록 불러오기
  fetchLikes: async (userId) => {
    const res = await axios.get(`${BASE_URL}/likes/${userId}`);
    set({ likedItems: res.data });
  },

  // 찜 토글
  toggleLike: async (product, userId) => {
    await axios.post(`${BASE_URL}/likes/toggle`, {
      userId,
      productId: product.id,
    });

    // 토글 후 찜 목록 다시 불러오기
      const res = await axios.get(`${BASE_URL}/likes/${userId}`);
      set({ likedItems: res.data });
  },
}));