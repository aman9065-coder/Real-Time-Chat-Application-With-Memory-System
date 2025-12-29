import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Logo from './Logo'

const Icon = ({ name, className = 'w-5 h-5' }) => {
  if (name === 'home') return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/></svg>
  )
  if (name === 'login') return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m12 0l-4-4m4 4l-4 4M21 12v7a2 2 0 0 1-2 2H7"/></svg>
  )
  if (name === 'logout') return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5-5-5"/></svg>
  )
  return null
}

const Nav = () => {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  // check auth status using cookie/token on mount
  useEffect(() => {
    let mounted = true;
    api.get('/auth/me')
      .then(() => {
        if (mounted) {
          setIsAuth(true);
          localStorage.setItem('isLoggedIn', 'true');
        }
      })
      .catch(() => {
        if (mounted) {
          setIsAuth(false);
          localStorage.removeItem('isLoggedIn');
        }
      });

    const onAuthChange = () => {
      setIsAuth(!!localStorage.getItem('isLoggedIn'));
    };

    window.addEventListener('storage', onAuthChange);
    window.addEventListener('auth-change', onAuthChange);

    return () => {
      mounted = false;
      window.removeEventListener('storage', onAuthChange);
      window.removeEventListener('auth-change', onAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Ask backend to clear the cookie
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API failed', err?.response?.data || err.message);
    } finally {
      localStorage.removeItem('isLoggedIn');
      // dispatch custom event so same-tab listeners update
      window.dispatchEvent(new Event('auth-change'));
      setIsAuth(false);
      navigate('/login');
    }
  };

  return (
    <nav className='w-full px-4 sm:px-6 py-2 flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <button onClick={()=> window.dispatchEvent(new Event('toggle-sidebar'))} aria-label='Open sidebar' title='Open sidebar' className='sm:hidden p-2 mr-2 rounded hover:bg-gray-200'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <Logo />
      </div>

      <div className='flex items-center gap-4'>
        {!isAuth ? (
          <>
            <NavLink to={'/login'} className={({isActive})=> isActive ? 'flex items-center gap-2 text-white font-semibold' : 'flex items-center gap-2 text-gray-300 hover:text-white'}><Icon name='login'/> Login</NavLink>
            <NavLink to={'/register'} className={({isActive})=> isActive ? 'flex items-center gap-2 text-white font-semibold' : 'flex items-center gap-2 text-gray-300 hover:text-white'}><Icon name='login'/> Register</NavLink>
          </>
        ) : (
          <>
            <NavLink to={'/home'} className={({isActive})=> isActive ? 'flex items-center gap-2 text-white font-semibold' : 'flex items-center gap-2 text-gray-300 hover:text-white'}><Icon name='home'/> Home</NavLink>
            <button onClick={handleLogout} aria-label='Logout' title='Logout' className='flex items-center gap-2 bg-transparent border border-gray-600 text-gray-200 px-3 py-1 rounded hover:bg-gray-700'><Icon name='logout'/> Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav