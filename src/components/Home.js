import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import Header from './Header'; 
import BlogList from './Bloglist';
import LoginRegister from './LoginRegister';
import AddBlog from './AddBlog';

const Home = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      {auth ? (
        <div>
          <Header />
          <BlogList />
          <AddBlog />
        </div>
      ) : (
        <LoginRegister />
      )}
    </div>
  );
};

export default Home;
