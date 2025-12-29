import React from 'react'

const Logo = ({ size = 36 }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center"
        aria-hidden
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path fill="currentColor" d="M12 2L2 7v6c0 5 3.8 9.7 10 13 6.2-3.3 10-8 10-13V7l-10-5z" />
        </svg>
      </div>
      <div>
        <div className="text-lg font-bold tracking-wide text-gray-100">ZORO</div>
        <div className="text-xs text-gray-400">AI Chat</div>
      </div>
    </div>
  )
}

export default Logo
