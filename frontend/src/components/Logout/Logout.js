import './Logout.css';
import logo from '../../assets/Login/logo.png';
import { useNavigate } from 'react-router-dom';

function Logout(props) {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-bogo">
          <div className="logo-container">
            <img className="logo" src={logo} alt="easel" />
          </div>
          <div className="login-heading-container">
            <h1 className="login-header">Ez-el</h1>
            <p className="login-subheader">You've successfully logged out!</p>
          </div>
        </div>

        <div className="login-options-container">
          <span className="text-white">Want to log in?</span>
          <button
            className="btn-alt"
            onClick={() => {
              navigate('/login');
            }}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
