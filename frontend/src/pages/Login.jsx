import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        await signUp(email, password);
        alert("회원가입 완료? 이메일 인증 후 로그인 해주세요.");
      } else {
        await signIn(email, password);
        navigate("/");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-5 max-w-sm mx-auto mt-20">
      <h2 className="text-xl font-bold mb-6">
        {isSignUp ? "회원가입" : "로그인"}
      </h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        type="email"
        className="w-full border p-2 mb-3 rounded"
      />
      
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        type="password"
        className="w-full border p-2 mb-3 rounded"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded mb-3"
      >
        {isSignUp ? "가입하기" : "로그인"}
      </button>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full text-sm text-gray-500"
      >
        {isSignUp ? "이미 계정이 있어요 -> 로그인" : "계정이 없어요 -> 회원가입"}
      </button>
    </div>
  );
};

export default Login;