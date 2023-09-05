import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Account from './components/Account';
import { AuthContext } from './context/AuthProvider';
import LoginRegister from './components/LoginRegister';

const App = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {!auth && <Route path="/*" element={<Navigate to="/auth/login" />} />}
        {auth && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
          </>
        )}
        <Route path="/auth/login" element={<LoginRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
