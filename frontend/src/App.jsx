import React from 'react'
import MainRoutes from './routes/MainRoutes'
import Nav from './components/Nav'

const App = () => {
  return (
    <div className='w-screen h-screen bg-gray-800 text-white'>
      <Nav/>
       <MainRoutes/>
    </div>
   
  )
}

export default App