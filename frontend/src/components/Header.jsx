import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useUserStore();

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
              <span className="text-sm text-gray-600">
                {currentUser.email}
              </span>
              <button
                onClick={() => navigate("/mypage")}
                className="text-sm text-gray-600 hover:text-blue-500"
              >
                마이페이지
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="text-sm text-gray-600 hover:text-blue-500"
              >
                채팅
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