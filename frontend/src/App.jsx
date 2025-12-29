import React from 'react'
import MainRoutes from './routes/MainRoutes'
import Nav from './components/Nav'

const App = () => {
  return (
    <div className='h-screen overflow-hidden bg-[#0b1220] text-gray-100 flex flex-col'>
      <Nav/>
      <main className='w-full px-4 sm:px-6 py-2 flex-1 overflow-hidden'>
        <MainRoutes/>
      </main>
    </div>
   
  )
}

export default App

