import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '../pages/register'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ChatPage from '../components/ChatPage'

const MainRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} >
          <Route path="/chat/:id" element={<ChatPage />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         
      </Routes>
  )
}

export default MainRoutes