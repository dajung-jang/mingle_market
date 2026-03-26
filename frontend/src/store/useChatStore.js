import { create } from "zustand";

export const useChatStore = create((set) => ({
  chatRooms: {},

  sendMessage: (roomId, message) =>
    set((state) => {
      const prevMessages = state.chatRooms[roomId] || [];

      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: [
            ...prevMessages,
            {
              id: Date.now(),
              text: message,
              mine: true,
            },
          ],
        },
      };
    }),
}));