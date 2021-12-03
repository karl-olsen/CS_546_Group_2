import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import whiteboard from '../../assets/Courses/whiteboard.png';
import userIcon from '../../assets/Login/user.svg';
import lockIcon from '../../assets/Login/lock.svg';
import { useState } from 'react';
import exportedObj from '../../providers/AuthProvider';
import './Create.css';
import { toast } from 'react-toastify';
import env from '../../env';

function Create() {
  const notify = (message) => toast.error(message);

  let navigate = useNavigate();
  let location = useLocation();
  let auth = exportedObj.useAuth();
  const user = JSON.parse(localStorage.user)
  console.log(user)
  const [courseName, setCourseName] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  // if we want to tell user where they came from
  let from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e = e || window.event;
    e.preventDefault();

    await axios.post(`${env?.apiUrl}/courses`, {
        courseName: courseName,
        userId: user.id
    })
    setIsSuccessful(true);
  }

  return (
    <div className="courses-container">
      <div className="courses-wrapper">
        <div className="courses-bogo">
          <div className="logo-container">
            <img className="logo" src={whiteboard} alt="whiteboard" width="200"/>
          </div>
          <div className="courses-heading-container">
            <h1 className="courses-header">Create a course</h1>
            <p className="courses-subheader">{!isSuccessful ? `To create a course, enter the course name and click "CREATE COURSE".`: 'Course Uploaded Successfully!'}</p>
          </div>
        </div>
        <form onSubmit={async (e) => await handleSubmit(e)}>
          <div className="courses-fields-container">
            <label className="visuallyhidden">
              Course Name
            </label>
            <div className="position-relative">
              <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" />
              <input
                className="courses-input"
                required
                type="text"
                name="createCourse"
                id="createCourse"
                placeholder="Course Name"
                autoComplete="username"
                value={courseName || ''}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>

            <label className="visuallyhidden" htmlFor="password">
              Password
            </label>
          </div>

          <div className="courses-snackbar">
            <button className="btn-primary" type="submit" onClick={() => {}}>
              Create Course
            </button>
          </div>
        </form>
        <div className="courses-options-container">
        </div>
      </div>
    </div>
  );
}

export default Create;
