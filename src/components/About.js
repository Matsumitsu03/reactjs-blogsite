import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import Header from './Header';
import LoginRegister from './LoginRegister';

const About = () => {

  const { auth } = useContext(AuthContext);

  return (
    <div>
      {auth ? (
        <div>
          <Header />
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col justify-center items-center p-8 rounded-lg shadow-md sm:w-4/5 w-11/12">
              <h2 className="text-2xl font-semibold mb-4">About My Blog Website</h2>
              <p className="text-gray-700">
                Welcome to my blog website! This platform was created to provide a space for you to share your thoughts, ideas, and stories with the world. I'm dedicated to making it easy for you to connect with others, engage in meaningful discussions, and showcase your writing skills.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">Features:</h3>
              <ul className="list-disc pl-5">
                <li className="text-gray-700">Post Blogs: Share your thoughts and experiences with the community.</li>
                <li className="text-gray-700">Comment: Engage with other users by leaving comments on their posts.</li>
                <li className="text-gray-700">User Authentication: Securely sign in with Firebase Auth.</li>
                <li className="text-gray-700">Data Storage: Store your blog posts and comments using Firestore.</li>
              </ul>

              <p className="text-gray-700 mt-6">
                We hope you enjoy using my platform to connect with others and share your ideas. If you have any questions or feedback, feel free to reach out. Happy blogging!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <LoginRegister />
      )}
    </div>
  )
}

export default About;