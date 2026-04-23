import { create } from "zustand";

export const useProductStore = create ((set) => ({
  products: [],

  // 상품 등록
  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        {
          ...product,
          id: Date.now(),
        },
      ],
    })),

    // 상품 삭제
    deleteProduct: (id) =>
      set((state) => ({
        products: state.products.filter(
          (item) => item.id !== id
        ),
      })),

    // 상품 수정
      updateProduct: (updateProduct) => 
        set((state) => ({
          products: state.products.map((item) =>
            item.id === updateProduct.id
              ? updateProduct
              : item
          ),
        })),
}));