import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav = () => {
  return (
    <div className='w-[100% ]  flex justify-center gap-2'>
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/login'}>Login</NavLink>
        <NavLink to={'/register'}>Register</NavLink>
    </div>
  )
}

export default Nav