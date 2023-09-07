import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Header = () => {

  const handleLogout = async () => {
    try {
      const firebaseAuth = getAuth();
      await signOut(firebaseAuth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-16 w-full bg-slate-800">
      <div className='flex items-center'>
        <Link to="/" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">Home</Link>
        <Link to="/about" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">About</Link>
        <Link to="/account" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">Account</Link>
        <button onClick={handleLogout} className='absolute inset-y-3 right-2 w-9 h-9'>
        <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='w-8 h-8 fill-sky-200'>
          <path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-16-7v20h14v-2h-12v-16h12v-2h-14z"/>
        </svg>
      </button>
      </div>
    </div>
  );
};

export default Header;
