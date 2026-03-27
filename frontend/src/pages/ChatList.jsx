import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../store/useUserStore";

const ChatList = () => {
  const navigate = useNavigate();
  const { chatRooms } = useChatStore();
  // 현재 유저 정보 가져오기
  const { currentUser } = useUserStore();

  // 판매, 구매 채팅탭 구분 (buy/sell)
  const [tab, setTab] = useState("buy");

  // 채팅방 리스트 테스트 더미
  // const chats = [
  //   {id: 1, user: "홍길동", lastMessage: "구매 가능할까요?" },
  //   {id: 2, user: "아무개", lastMessage: "팔렸나요?" },
  // ];

  // 채팅방 리스트 (필터링)
  const chatList = Object.entries(chatRooms).filter(
    ([roomId]) => {
      const [productId, buyerId, sellerId] = roomId.split("-");
        
      if (tab === "buy") {
        return buyerId === currentUser.id;
      } else {
        return sellerId === currentUser.id;
      }
    }
  );

  return (
    <div className="p-5">
      <div className="flex flex-start">
        <button
        onClick={() => navigate(-1)}
        className="mb-4 text-2xl text-bold text-black mr-5 mb-2"
      >
        ←
      </button>
        <h2 className="text-xl font-bold mb-4">채팅</h2>
      </div>


      {/* 구매 판매 탭 */}
      <div className="flex mb-4">
        <button
          onClick={() => setTab("buy")}
          className={`flex-1 py-2 ${
            tab === "buy"
              ? "border-b-2 border-black font-bold"
              : "text-gray-400"
          }`}
        >
          구매
        </button>

        <button
          onClick={() => setTab("sell")}
          className={`flex-1 py-2 ${
            tab === "sell"
              ? "border-b-2 border-black font-bold"
              : "text-gray-400"
          }`}
        >
          판매
        </button>
      </div>

      {chatList.length === 0 ? (
        <p className="text-gray-400">
          채팅 내역이 없습니다.
        </p>
      ) : (
        chatList.map(([roomId, messages]) => {
          const lastMessage = messages[messages.length -1];
            
          // roomId 분해
          const [productId, buyerId, sellerId] = roomId.split("-");

          // 채팅 시간
          const time = lastMessage?.createdAt
            ? new Date(
                lastMessage?.createAt
              ).toLocaleTimeString([], { 
              hour: "2-digit", 
              minute:"2-digit" 
            })
          : "";

          return (
            <div
              key={roomId}
              onClick={() =>
                navigate(`/chat/${productId}/${buyerId}/${sellerId}`)
              }
              className="p-4 border-b cursor-pointer hover:bg-gray-100"
            >
              <div className="flex justify-between">
                <p className="font-semibold">
                  상품 {productId}
                </p>
                <span className="text-sm text-gray-400">
                  {time}
                </span>
              </div> 

              <p className="text-gray-500 text-sm truncate">
                {lastMessage?.text}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;