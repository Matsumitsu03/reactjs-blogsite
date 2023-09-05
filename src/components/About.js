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
        </div>
      ) : (
        <LoginRegister />
      )}
    </div>
  )
}

export default About;