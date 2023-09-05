import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const firebaseAuth = getAuth();
      await signOut(firebaseAuth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-16 w-full bg-slate-800">
      <div className='flex'>
        <Link to="/" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">Home</Link>
        <Link to="/about" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">About</Link>
        <Link to="/account" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">Account</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
