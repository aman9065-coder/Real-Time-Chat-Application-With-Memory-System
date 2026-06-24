import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ChatPage from '../components/ChatPage'

const RequireAuth = ({ children }) => {
  const isAuth = !!localStorage.getItem('isLoggedIn');
  return isAuth ? children : <Navigate to="/login" replace />;
};

const MainRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} >
          <Route path="chat/:id" element={<ChatPage />} />
        </Route>
      </Routes>
  )
}

export default MainRoutes