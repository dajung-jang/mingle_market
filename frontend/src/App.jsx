import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
// import Write from "./pages/Write";
// import Chat from "./pages/Chat";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/product/:id' element={<Detail />} />
        {/* <Route path='/write' element={<Write />} />
        <Route path='/chat' element={<Chat />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;