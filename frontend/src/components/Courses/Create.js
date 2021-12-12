import axios from 'axios';
import whiteboard from '../../assets/Courses/whiteboard.png';
import userIcon from '../../assets/Login/user.svg';
import { useState } from 'react';
import './Create.css';
import env from '../../env';
import { toast } from 'react-toastify';

function validateInput(string, fieldName)  {
  if (!string) throw new Error(fieldName + ' is undefined or null, please provide input.');
  if (typeof string !== 'string') throw new Error(fieldName + ' must be of type string.');
  if (string.length === 0) throw new Error(fieldName + ' must be greater than 0 in length.');
  if (!string.trim().length) throw new Error(fieldName + ' contained only whitespace.');
};

function Create() {
  const user = JSON.parse(localStorage.user);
  const notify = (message) => toast.error(message);
  const success = (message) => toast.success(message);
  const [courseName, setCourseName] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  async function handleSubmit(e) {
    e = e || window.event;
    e.preventDefault();

    try {
      validateInput(courseName, "Course name");

      await axios.post(`${env?.apiUrl}/courses`, {
        courseName: courseName,
        userId: user.id,
      });
      setIsSuccessful(true);
      success('New course created!');
    } catch (e) {
      notify(e?.response?.data?.error || 'Failed to create course');
    }

    setCourseName('');
    e.target.reset();
  }

  return (
    <>
      {user.role === 'teacher' ? (
        <div className="courses-container">
          <div className="courses-wrapper">
            <div className="courses-bogo">
              <div className="logo-container">
                <img className="logo" src={whiteboard} alt="whiteboard" width="200" />
              </div>
              <div className="courses-heading-container">
                <h1 className="courses-header">Create a course</h1>
                <p className="courses-subheader">
                  {!isSuccessful
                    ? `To create a course, enter the course name and click "CREATE COURSE".`
                    : 'Course Uploaded Successfully!'}
                </p>
              </div>
            </div>
            <form onSubmit={async (e) => await handleSubmit(e)}>
              <div className="courses-fields-container">
                <label className="visuallyhidden">Course Name</label>
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
            <div className="courses-options-container"></div>
          </div>
        </div>
      ) : (
        <div>403 Unauthorized.</div>
      )}
    </>
  );
}

export default Create;
