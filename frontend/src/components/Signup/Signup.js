import './Signup.css';
import logo from '../../assets/Login/logo.png';
import userIcon from '../../assets/Login/user.svg';
import lockIcon from '../../assets/Login/lock.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import env from '../../env';

function Signup() {
  const notify = (message) => toast.error(message);
  const placeholderFormData = Object.freeze({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: '',
  });
  const [loginData, setLoginData] = useState(placeholderFormData);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e = e || window.event;
    e.preventDefault();

    // Check input fields
    setLoading(true);

    if (loginData.password === loginData.confirmPassword) {
      // need to handle scenario where email already exists
      // display loading spinner
      console.log(loginData);

      try {
        const { email, password, firstName, lastName, role } = loginData;
        const res = await axios.post(`${env.apiUrl}/register`, {
          email,
          password,
          firstName,
          lastName,
          role,
        });
        if (!res.data || !res.data.status) throw new Error('Failed to register new user');
        setLoginData(placeholderFormData);
        e.target.reset();
        navigate('/login');
      } catch (e) {
        notify(e?.response?.data?.error || e?.message);
      }
    } else {
      notify('Your passwords do not match!');
    }
    setLoading(false);
  }

  const updateForm = (e) => {
    if (e.target.id === 'email') {
      setLoginData({
        ...loginData,
        email: e.target.value,
      });
    }

    if (e.target.id === 'password') {
      setLoginData({
        ...loginData,
        password: e.target.value,
      });
    }

    if (e.target.id === 'confirmPassword') {
      setLoginData({
        ...loginData,
        confirmPassword: e.target.value,
      });
    }

    if (e.target.id === 'firstName') {
      setLoginData({
        ...loginData,
        firstName: e.target.value,
      });
    }

    if (e.target.id === 'lastName') {
      setLoginData({
        ...loginData,
        lastName: e.target.value,
      });
    }

    if (e.target.name === 'role') {
      setLoginData({
        ...loginData,
        role: e.target.value,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-bogo">
          <div className="logo-container">
            <img className="logo" src={logo} alt="easel" />
          </div>
          <div className="login-heading-container">
            <h1 className="login-header">Ez-el</h1>
            <p className="login-subheader">Let's get you signed up! Please fill in some information below.</p>
          </div>
        </div>
        {loading ? (
          <div class="loading__container">
            <div class="loading__wrapper">
              <div class="loader"></div>
            </div>
          </div>
        ) : null}
        <form onSubmit={async (e) => await handleSubmit(e)}>
          <div className="login-fields-container">
            <label className="visuallyhidden" htmlFor="firstName">
              First Name
            </label>
            <div className="position-relative">
              <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" />
              <input
                className="login-input"
                required
                type="text"
                name="firstName"
                id="firstName"
                placeholder="FIRST NAME"
                value={loginData.firstName || ''}
                onChange={updateForm}
              />
            </div>

            <label className="visuallyhidden" htmlFor="lastName">
              Last Name
            </label>
            <div className="position-relative">
              <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" />
              <input
                className="login-input"
                required
                type="text"
                name="lastName"
                id="lastName"
                placeholder="LAST NAME"
                value={loginData.lastName || ''}
                onChange={updateForm}
              />
            </div>

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
                value={loginData.email || ''}
                onChange={updateForm}
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
                value={loginData.password || ''}
                onChange={updateForm}
              />
            </div>
            <label className="visuallyhidden" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="position-relative">
              <img className="input-icon" src={lockIcon} alt="closed lock stroke icon" aria-hidden="true" />
              <input
                required
                className="login-input"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="CONFIRM PASSWORD"
                value={loginData.confirmPassword || ''}
                onChange={updateForm}
              />
            </div>

            <div className="signup-roles-container" onChange={(e) => updateForm(e)}>
              <p className="text-white">For the purposes of the demo, please choose a role.</p>
              <div className="signup-radio-container">
                <div className="position-relative signup-radio-wrapper">
                  <label htmlFor="studentRole">Student Role</label>
                  <input className="signup-radio" type="radio" id="studentRole" name="role" value="student" required />
                </div>
                <div className="position-relative signup-radio-wrapper">
                  <label htmlFor="teacherRole">Teacher Role</label>
                  <input className="signup-radio" type="radio" id="teacherRole" name="role" value="teacher" required />
                </div>
              </div>
            </div>
          </div>

          <div className="login-snackbar">
            <button className="btn-primary" type="submit" onClick={() => {}}>
              Sign up
            </button>
          </div>
        </form>
        <div className="login-options-container">
          <span className="text-white">Already have an account?</span>
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

export default Signup;
