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
    set({ chatRooms: res.data });
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
        console.log("websocket 연결 성공")
        client.subscribe(`/topic/chat/${roomId}`, (msg) => {
          const newMessage = JSON.parse(msg.body);
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
        });
      },
      onDisconnect: () => {
        console.log("websocket 연결 끊김");
      },
      onStompError: (frame) => {
        console.log("stomp 에러:", frame);
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

    const message = { roomId, text, senderId };

    stompClient.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify({ roomId, text, senderId }),
    });

    // 채팅 보낸거 바로 화면에 뜨게
    // set((state) => ({
    //   messages: [...state.messages, { ...message, id: Date.now() }],
    // }));
  },
}));