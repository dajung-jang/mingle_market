import { create } from "zustand";

export const useLikeStore = create((set) => ({
  likedItems: [],

  toggleLike: (product) =>
    set((state) => {
      const exists = state.likedItems.find(
        (item) => item.id === product.id
      );

      if (exists) {
        return {
          likedItems: state.likedItems.filter(
            (item) => item.id !== product.id
          ),
        };
      } else {
        return {
          likedItems: [...state.likedItems, product],
        };
      }
    }),
}));