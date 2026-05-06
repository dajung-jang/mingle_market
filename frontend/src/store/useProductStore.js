import { create } from "zustand";
import { productApi } from "../api/productApi";

export const useProductStore = create ((set) => ({
  products: [],
  totalPages: 1,
  currentPage:1,

  // 전체 상품 불러오기
  fetchProducts: async (page = 1) => {
    const res = await productApi.getAll(page);
    set({
      products: res.data.products,
      totalPages: res.data.totalPages,
      currentPage: res.data.currentPage,
    });
  },

  // 상품 등록
  addProduct: async (product) => {
    await productApi.add(product);
  },

  // 상품 수정
  updateProduct: async (id, product) => {
    await productApi.update(id, product);
  },

  // 상품 삭제
  deleteProduct: async (id) => {
    await productApi.delete(id);
  },
}));