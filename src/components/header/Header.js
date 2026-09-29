import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Header() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <div className='bg-white fixed min-w-full flex  items-center justify-between shadow-md z-50'>
        <div className=" font-inherit font-bold text-purple-600 py-4 px-6 sm:text-3xl">Campus MarketPlace</div>
        <div className="hidden lg:block">
            <button className='rounded-l-lg h-10 w-9'>🔍</button>
            <input className='border-b-2 w-96 h-10 focus:outline-none' type="text" placeholder='Search hear...' />
        </div>
        <div className="flex items-center">

            <button className='px-1 sm:px-3 py-1.5 m-2 rounded-lg rounded-bl-lg bg-purple-500 hover:bg-purple-600 transition-colors duration-500'
            onClick={ ()=> {navigate("/Form")} }
            >+ sell items</button>

            {currentUser ? (
              <>
                <div className='flex items-center gap-2 mx-2' title={`${currentUser.name} (${currentUser.enrollmentNumber})`}>
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className='h-9 w-9 rounded-full object-cover border-2 border-purple-400'
                  />
                  <div className='hidden md:block leading-tight'>
                    <p className='text-sm font-semibold text-gray-800'>{currentUser.name}</p>
                    <p className='text-xs text-gray-500'>{currentUser.enrollmentNumber}</p>
                  </div>
                </div>
                <button
                onClick={handleLogout}
                className='px-1 sm:px-3 py-1.5 m-2 rounded-lg rounded-bl-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-500' >Logout</button>
              </>
            ) : (
              <button
              onClick={()=>{navigate("/Login")}}
              className='px-1 sm:px-3 py-1.5 m-2  rounded-lg rounded-bl-lg bg-purple-500 hover:bg-purple-600 transition-colors duration-500' >Login</button>
            )}
        </div>
      </div>

    </div>
  )
}

export default Header
