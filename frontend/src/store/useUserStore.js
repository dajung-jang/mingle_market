import { create } from "zustand";

export const useUserStore = create(() => ({
  currentUser: {
    id: "user1",
    name: "다정",
  },
}));