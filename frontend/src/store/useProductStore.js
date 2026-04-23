import { create } from "zustand";
import { productApi } from "../api/productApi";

export const useProductStore = create ((set) => ({
  products: [],

  // 전체 상품 불러오기
  fetchProducts: async () => {
    const res = await productApi.getAll();
    set({ products: res.data });
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

  // // 상품 등록
  // addProduct: (product) =>
  //   set((state) => ({
  //     products: [
  //       ...state.products,
  //       {
  //         ...product,
  //         id: Date.now(),
  //       },
  //     ],
  //   })),

  //   // 상품 삭제
  //   deleteProduct: (id) =>
  //     set((state) => ({
  //       products: state.products.filter(
  //         (item) => item.id !== id
  //       ),
  //     })),

  //   // 상품 수정
  //     updateProduct: (updateProduct) => 
  //       set((state) => ({
  //         products: state.products.map((item) =>
  //           item.id === updateProduct.id
  //             ? updateProduct
  //             : item
  //         ),
  //       })),
}));