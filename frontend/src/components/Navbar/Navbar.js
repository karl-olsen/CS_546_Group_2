import exportedObj from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';
import logo from '../../assets/Login/logo.png';
import './Navbar.css';
import { useEffect, useState } from 'react';

function Navbar() {
  let auth = exportedObj.useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  let [isDashboard, setDashboard] = useState(false);
  let [isEnroll, setEnroll] = useState(false);
  let [isCreateCourse, setCreateCourse] = useState(false);
  let [isCreateAssignment, setCreateAssignment] = useState(false);
  const { id } = useParams();
  const user = localStorage.user && JSON.parse(localStorage.user);

  useEffect(() => {
    console.log(location.pathname);
    if (user && user.authenticated) {
      //dashboard
      if (location.pathname === '/' || location.pathname === '/dashboard') {
        setDashboard(false);
        setCreateCourse(true);
      } else {
        setDashboard(true);
        setCreateCourse(false);
      }
      //enroll
      if (location.pathname === '/courses/enroll') {
        setEnroll(false);
      } else {
        setEnroll(true);
      }
      //create assignment
      if (/^(\/courses\/[a-zA-Z0-9]{24})$/.test(location.pathname)) {
        setCreateAssignment(true);
      } else {
        setCreateAssignment(false);
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

  const navCreateCourse = (e) => {
    e.preventDefault();
    navigate('/courses/create');
  };

  const navCreateAssignment = (e) => {
    e.preventDefault();
    navigate(`/courses/${id}/assignments/create`);
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
        {user && user.role !== 'teacher' && isEnroll && (
          <button
            className="nav-button"
            onClick={(e) => {
              navEnroll(e);
            }}
          >
            Enroll
          </button>
        )}
        {user && user.role === 'teacher' && isCreateCourse && (
          <button
            className="nav-button"
            onClick={(e) => {
              navCreateCourse(e);
            }}
          >
            Create Course
          </button>
        )}
        {user && user.role === 'teacher' && isCreateAssignment && (
          <button
            className="nav-button"
            onClick={(e) => {
              navCreateAssignment(e);
            }}
          >
            Create Assignment
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
