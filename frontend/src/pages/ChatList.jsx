import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const navigate = useNavigate();

  const chats = [
    {id: 1, user: "홍길동", lastMessage: "구매 가능할까요?" },
    {id: 2, user: "아무개", lastMessage: "팔렸나요?" },
  ];

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">채팅</h2>

      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => navigate(`/chat/${chat.id}`)}
          className="p-4 border-b cursor-pointer hover:bg-gray-100"
        >
          <p className="font-semibold">{chat.user}</p>
          <p className="text-gray-500 text-sm">
            {chat.lastMessage}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;