import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const ChatList = () => {
  const navigate = useNavigate();
  const { chatRooms, fetchChatRooms } = useChatStore();
  // 현재 유저 정보 가져오기
  const { currentUser } = useUserStore();

  // 판매, 구매 채팅탭 구분 (buy/sell)
  const [tab, setTab] = useState("buy");
  const [productMap, setProductMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [unreadMap, setUnreadMap] = useState({});

  useEffect(() => {
    if (currentUser) fetchChatRooms(currentUser.id);
  }, [currentUser]);

  // 상품 정보, 유저 닉네임 불러오기
  useEffect(() => {
    if(chatRooms.length === 0) return;

    chatRooms.forEach(async (room) => {
      // 상품 정보
      if (!productMap[room.productId]) {
        const res = await axios.get(`${BASE_URL}/products/${room.productId}`);
        setProductMap((prev) => ({ ...prev, [room.productId]: res.data }));
      }
      // 유저 닉네임
      const otherUserId = tab === "buy" ? room.sellerId : room.buyerId;
      if (!userMap[otherUserId]) {
        const res = await axios.get(`${BASE_URL}/users/${otherUserId}`);
        setUserMap((prev) => ({ ...prev, [otherUserId]: res.data }));
      }
      // 안읽은 메세지 수
      const res = await axios.get(`${BASE_URL}/chat/unread/${room.id}/${currentUser.id}`);
      setUnreadMap((prev) => ({ ...prev, [room.id]: res.data }));
    });
  }, [chatRooms, tab]);

  // 채팅방 리스트 (필터링)
  const filteredRooms = chatRooms.filter((room) =>
    tab === "buy"
      ? room.buyerId === currentUser?.id
      : room.sellerId === currentUser?.id
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">채팅</h2>

      {/* 구매 판매 탭 */}
      <div className="flex mb-4 border-b">
        <button
          onClick={() => setTab("buy")}
          className={`flex-1 py-2 ${
            tab === "buy"
              ? "border-b-2 border-blue-500 text-blue-500 font-bold"
              : "text-gray-400"
          }`}
        >
          구매
        </button>
        <button
          onClick={() => setTab("sell")}
          className={`flex-1 py-2 ${
            tab === "sell"
              ? "border-b-2 border-blue-500 text-blue-500 font-bold"
              : "text-gray-400"
          }`}
        >
          판매
        </button>
      </div>

      {filteredRooms.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          채팅 내역이 없습니다.
        </p>
      ) : (
        filteredRooms.map((room) => {
          const product = productMap[room.productId];
          const otherUserId = tab === "buy" ? room.sellerId : room.buyerId;
          const otherUser = userMap[otherUserId];
          const unreadCount = unreadMap[room.id] || 0;

          return (
            <div
              key={room.id}
              onClick={() =>
                navigate(`/chat/${room.productId}/${room.buyerId}/${room.sellerId}`)
              }
              className="flex itesm-center gap-4 p-4 border-b cursor-pointer hover:bg-gray-50"
            >
              {/* 상품 이미지 */}
              <img
                src={product?.image || "https://placehold.co/60x60"}
                alt={product?.title}
                className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                onError={(e) => { e.target.src = "https://placehold.co/60x60"}}
              />
              
              {/* 채팅 정보 */}
              <div className="flex-1">
                <p className="font-semibold">{product?.title || "상품 로딩중..."}</p>
                <p className="text-sm text-gray-400">
                  {tab === "buy" ? "판매자" : "구매자"}: {otherUser?.nickname || "로딩중..."}
                </p>
              </div>

              {/* 안읽은 메세지 수 */}
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;