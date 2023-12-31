import React, { useEffect, useState, createContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const firebaseAuth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setAuth(user);
      } else {
        setAuth(null);
      }
    });

    return () => unsubscribe();
  }, [firebaseAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};