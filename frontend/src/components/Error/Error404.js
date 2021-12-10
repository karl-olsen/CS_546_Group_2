import { ReactComponent as Dashboard404 } from '../../assets/Error/Dashboard404.svg';
import { ReactComponent as Login404 } from '../../assets/Error/Login404.svg';
import './Error.css';

const Error404 = () => {
  const user = localStorage.user && JSON.parse(localStorage.user);
  return (
    <>
      {user && user.authenticated ? (
        <Dashboard404 height="100%" width="100%" />
      ) : (
        <Login404 height="100%" width="100%" />
      )}
    </>
  );
};

export default Error404;
