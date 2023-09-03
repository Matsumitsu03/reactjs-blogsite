import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="flex items-center justify-center h-16 w-full bg-slate-800">
      <div className='flex'>
        <Link to="/" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">Home</Link>
        <Link to="/about" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">About</Link>
        <Link to="/account" className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">Account</Link>
      </div>
    </div>
  );
};

export default Header;
