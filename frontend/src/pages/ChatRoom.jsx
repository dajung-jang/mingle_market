import { useParams } from "react-router-dom";
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useUserStore} from "../store/useUserStore";

const ChatRoom = () => {
  const { productId, buyerId, sellerId } = useParams();

  const roomId = `${productId}-${buyerId}-${sellerId}`;
  const [input, setInput] = useState("");

  const { chatRooms, sendMessage } = useChatStore();

  const messages = chatRooms[roomId] || [];

  const { currentUser } = useUserStore();

  // 판매자인지 구매자인지
  const isMine = (msg) => 
    msg.senderId === currentUser.id;

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(roomId, input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      
      {/* 헤더 */}
      <div className="p-4 border-b font-bold">
        상품 #{productId} 채팅
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center">
            아직 대화가 없습니다.
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.mine ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                msg.mine
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="메시지 입력..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;