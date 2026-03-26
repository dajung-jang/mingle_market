import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import MyPage from './pages/MyPage';
// import Write from "./pages/Write";
import ChatRoom from "./pages/ChatRoom";
import ChatList from './pages/ChatList';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Detail />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* <Route path='/write' element={<Write />} /> */}
        <Route path="/chat" element={<ChatList />} /> 
        <Route path="/chat/:productId/:userId" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;