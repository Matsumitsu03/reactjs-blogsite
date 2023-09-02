import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; 
import BlogList from './Bloglist';
import LoginRegister from './LoginRegister';
import AddBlog from './AddBlog';

const Home = () => {
  const { auth } = useContext(AuthContext);
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
    <div>
      {auth ? (
        <div>
          <Header />
          <button onClick={handleLogout}>Logout</button>
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
