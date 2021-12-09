import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/Login/logo.png';
import userIcon from '../../assets/Login/user.svg';
import lockIcon from '../../assets/Login/lock.svg';
import { useState } from 'react';
import exportedObj from '../../providers/AuthProvider';
import './Login.css';
import { toast } from 'react-toastify';
import Spinner from '../Spinner/Spinner';

function Login() {
  const notify = (message) => toast.error(message);

  let navigate = useNavigate();
  let location = useLocation();
  let auth = exportedObj.useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // if we want to tell user where they came from
  let from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e = e || window.event;
    e.preventDefault();

    // Check input fields
    // display loading spinner
    setLoading(true);

    await auth.signin({ email, password }, (res) => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      setEmail('');
      setPassword('');
      e.target.reset();
      if (res === true) {
        navigate(from, { replace: true });
      } else {
        notify(res?.response?.data?.error || 'Failed to login');
      }
      setLoading(false);
    });
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-bogo">
          <div className="logo-container">
            <img className="logo" src={logo} alt="easel" />
          </div>
          <div className="login-heading-container">
            <h1 className="login-header">Ez-el</h1>
            <p className="login-subheader">Welcome, please log in.</p>
          </div>
        </div>
        {loading ? <Spinner /> : null}
        <form onSubmit={async (e) => await handleSubmit(e)}>
          <div className="login-fields-container">
            <label className="visuallyhidden" htmlFor="email">
              Email
            </label>
            <div className="position-relative">
              <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" />
              <input
                className="login-input"
                required
                type="text"
                name="email"
                id="email"
                placeholder="EMAIL"
                autoComplete="username"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label className="visuallyhidden" htmlFor="password">
              Password
            </label>
            <div className="position-relative">
              <img className="input-icon" src={lockIcon} alt="closed lock stroke icon" aria-hidden="true" />
              <input
                required
                className="login-input"
                type="password"
                name="password"
                id="password"
                placeholder="PASSWORD"
                autoComplete="current-password"
                value={password || ''}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="login-snackbar">
            <button className="btn-primary" type="submit" onClick={() => {}}>
              LOGIN
            </button>
          </div>
        </form>

        <div className="login-options-container">
          <button
            className="btn-alt"
            onClick={() => {
              navigate('/signup');
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
