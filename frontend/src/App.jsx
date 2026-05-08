import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import MyPage from './pages/MyPage';
// import Write from "./pages/Write";
import ChatRoom from "./pages/ChatRoom";
import ChatList from './pages/ChatList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Login from './pages/Login';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          {/* <Route path='/write' element={<Write />} /> */}
          <Route path="/chat" element={<PrivateRoute><ChatList /></PrivateRoute>} /> 
          <Route path="/chat/:productId/:buyerId/:sellerId" element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;