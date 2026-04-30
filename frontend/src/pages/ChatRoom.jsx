import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../store/useUserStore";

const ChatRoom = () => {
  const { productId, buyerId, sellerId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const {
    messages,
    fecthMessages,
    connect,
    disconnect,
    sendMessage,
    getOrCreateRoom,
  } = useChatStore();

  // const roomId = `${productId}-${buyerId}-${sellerId}`;
  const [input, setInput] = useState("");
  const [roomId, setRoomId] =useState(null);
  const messagesEndRef = useRef(null); //맨 아래 ref 추가

  // // 판매자인지 구매자인지
  // const isMine = (msg) => 
  //   msg.senderId === currentUser.id;

  useEffect(() => {
    const init = async () => {
      const room = await getOrCreateRoom(
        Number(productId),
        buyerId,
        sellerId,
      );
      setRoomId(room.id);
      await fecthMessages(room.id);
      connect(room.id);
    };
    init();

    return () => disconnect(); 
  }, []);

  // 메세지 추가될 때마다 맨 아래로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;
    sendMessage(roomId, input, currentUser.id);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto">
      
      {/* 헤더 */}
      <div className="flex items-center gap-3 pb-4 border-b mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-blue-500"
        >
          ← 뒤로가기
        </button>
        <h2 className="font-bold text-lg">채팅</h2>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 mb-4 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            아직 대화가 없습니다.
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUser?.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs ${
                msg.senderId === currentUser?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* 맨 아래 anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="flex gap-2 border-t pt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-xl px-4 py-2 outline-none focus:border-blue-400"
          placeholder="메시지 입력..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;