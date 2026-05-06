import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useUserStore();
  const { unreadCount, fetchUnreadCount } = useChatStore();

  // 채팅 버튼 뱃지
  useEffect(() => {
    if (currentUser) fetchUnreadCount(currentUser.id);

    // 30초 마다 갱신
    const interval = setInterval(() => {
      if (currentUser) fetchUnreadCount(currentUser.id);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

   return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between item-center" >
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold texxt-blue-500 cursor-pointer"
        >
          MingleMarket
        </h1>

        <nav className="flex items-center gap-4">
          {currentUser ? (
            <>
              <div
                onClick={() => navigate("/mypage")}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
              >
                <img
                  src={currentUser.profileImage || "https://placehold.co/32x32"}
                  alt="프로필"
                  className="w-8 h-8 rounded-full object-cover bg-gray-100"
                  onError={(e) => { e.target.src = "https://placehold.co/32x32"; }}
                />
                <span className="text-sm font-semibold">
                  {currentUser.nickname}
                </span>
              </div>
              
              <button
                onClick={() => navigate("/chat")}
                className="relative text-sm text-gray-600 hover:text-blue-500"
              >
                채팅
                {/* 안읽은 메세지 수 뱃지 */}
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -rigth-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/add")}
                className="bg-blue-500 text-sm text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                상품 등록
              </button>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-red-500"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-blue-500"
              >
                로그인
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                회원가입
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
   );
};

export default Header;