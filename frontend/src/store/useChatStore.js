import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api"

export const useChatStore = create((set, get) => ({
  chatRooms: [],
  messages: [],
  stompClient: null,

  // 채팅방 목록 불러오기
  fetchChatRooms: async (userId) => {
    const res = await axios.get(`${BASE_URL}/chat/rooms/${userId}`);
    sessionStorage({ chatRooms: res.data });
  },

  // 채팅방 생성, 조회
  getOrCreateRoom: async (productId, buyerId, sellerId) => {
    const res = await axios.post(`${BASE_URL}/chat/room`, {
      productId,
      buyerId,
      sellerId,
    });
    return res.data;
  },

  // 메세지 목록 불러오기
  fecthMessages: async (roomId) => {
    const res = await axios.get(`${BASE_URL}/chat/messages/${roomId}`);
    set({ messages: res.data });
  },

  // websocket 연결
  connect: (roomId) => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe(`/topic/chat/${roomId}`, (msg) => {
          const newMessage = JSON.parse(msg.body);
          set((state) => ({
            message: [...state.messages, newMessage],
          }));
        });
      },
    });
    client.activate();
    set({ stompClient: client });
  },

  // websocket 연결 해제
  disconnect: () => {
    const { stompClient } = get();
    if (stompClient) stompClient.deactivate();
    set({ stompClient: null });
  },

  // 메시지 전송
  sendMessage: (roomId, text, senderId) => {
    const { stompClient } = get();
    if (!stompClient) return;
    stompClient.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify({ roomId, text, senderId }),
    });
  },
}));