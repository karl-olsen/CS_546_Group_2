import exportedObj from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/Login/logo.png';
import './Navbar.css';
import { useEffect, useState } from 'react';

function Navbar() {
  let auth = exportedObj.useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  let [isDashboard, setDashboard] = useState(false);
  let [isEnroll, setEnroll] = useState(false);
  const user = localStorage.user && JSON.parse(localStorage.user);

  useEffect(() => {
    console.log(location.pathname);
    if (user && user.authenticated) {
      if (location.pathname === '/' || location.pathname === '/dashboard') {
        setDashboard(false);
      } else {
        setDashboard(true);
      }
      if (location.pathname === '/courses/enroll') {
        setEnroll(false);
      } else {
        setEnroll(true);
      }
    }
  }, [location]);

  async function logout(e) {
    e.preventDefault();

    await auth.signout(() => {
      navigate('/logout');
    });
  }

  const navDashboard = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const navEnroll = (e) => {
    e.preventDefault();
    navigate('/courses/enroll');
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo-container">
        <img className="nav-logo" src={logo} alt="easel" />
      </div>
      <h1>Ez-El</h1>
      <div className="nav-button-div">
        {isDashboard && (
          <button
            className="nav-button"
            onClick={(e) => {
              navDashboard(e);
            }}
          >
            Dashboard
          </button>
        )}
        {isEnroll && (
          <button
            className="nav-button"
            onClick={(e) => {
              navEnroll(e);
            }}
          >
            Enroll
          </button>
        )}
        <button className="nav-button nav-logout" onClick={async (e) => await logout(e)}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
