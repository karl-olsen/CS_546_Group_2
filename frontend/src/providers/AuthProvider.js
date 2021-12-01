import { fakeAuthProvider } from './auth';
import { useLocation, Navigate } from 'react-router-dom';
import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import env from '../env';

let AuthContext = createContext({
  user: null,
  signin: null,
  signout: null,
});

function AuthProvider({ children }) {
  let [user, setUser] = useState(null);

  const authenticate = async (loginData, callback) => {
    try {
      const { email, password } = loginData;
      const res = await axios.post(`${env.apiUrl}/login`, {
        email,
        password,
      });
      console.log(res);
      callback();
    } catch (e) {
      console.log(e);
    }
  };

  let signin = async (loginInfo, callback) => {
    return authenticate(loginInfo, () => {
      // setUser(newUser);
      callback();
    });
  };

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

const auth = {
  useAuth,
  AuthProvider,
  RequireAuth,
};

export default auth;
