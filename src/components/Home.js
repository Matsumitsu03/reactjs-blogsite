import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import Header from './Header'; 
import BlogList from './Bloglist';
import LoginRegister from './LoginRegister';

const Home = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      {auth ? (
        <div>
          <Header />
          <BlogList />
          <div className='flex w-full items-center justify-center bg-gray-400 md:h-32 h-16'>
            <h1 className='texl-lg font-medium'>@Copyright MatsuThoughts 2023 - All Rights Reserved.</h1>
          </div>
        </div>
      ) : (
        <LoginRegister />
      )}
    </div>
  );
};

export default Home;
