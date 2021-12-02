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
  const storedJwt = localStorage.getItem('token');
  const [jwt, setJwt] = useState(storedJwt || null);
  const placeholderUser = Object.freeze({
    authenticated: false,
    email: null,
    firstName: null,
    lastName: null,
    role: null,
    token: jwt,
  });
  const [user, setUser] = useState(placeholderUser);

  const authenticate = async (loginData, callback) => {
    try {
      const { email, password } = loginData;
      const res = await axios.post(`${env.apiUrl}/login`, {
        email,
        password,
      });
      callback(res);
    } catch (e) {
      console.error(e);
    }
  };

  const unauthenticate = async (callback) => {
    try {
      console.log(jwt);
      const res = await axios.get(`${env?.apiUrl}/logout`);
      callback(res);
    } catch (e) {
      console.error(e);
    }
  };

  let signin = async (loginInfo, callback) => {
    return await authenticate(loginInfo, (res) => {
      const data = res.data;
      console.log(data.token);
      const user = {
        authenticated: data.authenticated,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        token: data.token,
      };
      setUser(user);
      setJwt(data.token);
      localStorage.setItem('token', data.token);
      callback();
    });
  };

  let signout = async (callback) => {
    return await unauthenticate((res) => {
      const data = res.data;
      console.log(data);
      // could add error handling in case fails
      localStorage.removeItem('token');
      setJwt(null);
      setUser(placeholderUser);
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

  if (!auth.user.authenticated) {
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
