import { create } from "zustand";

export const useProductStore = create ((set) => ({
  products: [],

  addProduct: (product) =>
    set((state) =< ({
      products: [
        ...state.products,
        {
          ...product,
          id: Date.now(),
        },
      ],
    })),
}));