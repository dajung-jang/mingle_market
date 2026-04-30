import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useUserStore } from './store/useUserStore.js'

// 앱 시작 시 로그인 상태 유지
const Root = () => {
  const { loadUser } = useUserStore();

  useEffect(() => {
    loadUser()
  }, [])

  return <App />
}

createRoot(document.getElementById('root')).render(
  <Root />
)
