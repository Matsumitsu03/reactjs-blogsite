import React from 'react';

const Header = () => {
  return (
    <div className="flex items-center justify-center h-16 w-full bg-slate-800">
        <div className='flex'>
            <button className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">Home</button>
            <button className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">About</button>
            <button className="bg-blue-400 rounded-lg p-2 m-2 font-bold text-zinc-950">Account</button>
        </div>
    </div>
  );
};

export default Header;
