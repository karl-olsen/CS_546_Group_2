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
    authenticated: jwt ? true : false,
    email: null,
    firstName: null,
    lastName: null,
    role: null,
    token: jwt,
    _id: null,
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
      callback(e);
    }
  };

  const unauthenticate = async (callback) => {
    try {
      const res = await axios.get(`${env?.apiUrl}/logout`);
      callback(res);
    } catch (e) {
      callback(e);
    }
  };

  let signin = async (loginInfo, callback) => {
    return await authenticate(loginInfo, (res) => {
      const data = res.data;
      if (!data) return callback(res);
      const user = {
        authenticated: data.authenticated,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        token: data.token,
        id: data.id,
      };
      setUser(user);
      setJwt(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      callback(user.authenticated);
    });
  };

  let signout = async (callback) => {
    return await unauthenticate((res) => {
      // could add error handling in case fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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

function RequireUnAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();
  let from = location.state?.from?.pathname || '/';

  if (auth.user.authenticated) {
    return <Navigate to={from} state={{ from: location }} />;
  }

  return children;
}

function RequireTeacher({ children }) {
  const localUser = JSON.parse(localStorage.user);

  if (localUser.role.toLowerCase() !== 'teacher') {
    return <Navigate to="/403" />;
  }

  return children;
}

function RequireStudent({ children }) {
  const localUser = JSON.parse(localStorage.user);

  if (localUser.role.toLowerCase() !== 'student') {
    return <Navigate to="/403" />;
  }

  return children;
}

const auth = {
  useAuth,
  AuthProvider,
  RequireAuth,
  RequireUnAuth,
  RequireTeacher,
  RequireStudent
};

export default auth;
