import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import env from '../../env';
import './Enroll.css';
import Spinner from '../Spinner/Spinner';

function Enroll() {
  let [courseList, setCourseList] = useState([]);
  let [loading, setLoading] = useState(true);
  const user = localStorage.user && JSON.parse(localStorage.user);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    (async () => {
      await axios
        .get(`${env.apiUrl}/courses/all`)
        .then((response) => {
          setCourseList(response.data);
          setLoading(false);
        })
        .catch((error) => {
          let errorMsg = typeof error === 'string' ? error : error.message ? error.message : 'Something went wrong';
          toast.error(errorMsg);
          setLoading(false);
        });
    })();
  }, []);

  const enroll = async (courseId) => {
    await axios
      .post(`${env.apiUrl}/enroll/`, {
        userId: user.id,
        courseId: courseId,
      })
      .then((response) => {
        notifySuccess('Successfully enrolled in the course!');
      })
      .catch((error) => {
        notifyError(error.response.data || 'Unable to enroll in the course. Try again!');
      });
  };

  const renderCourseItem = (course, index) => {
    return (
      <li className="enroll-course-container" key={index}>
        <div className="enroll-course-name">{course.courseName}</div>
        <button className="enroll-button" onClick={async () => enroll(course.courseId)}>
          Enroll
        </button>
      </li>
    );
  };

  const renderCourseList = courseList.map((course, index) => {
    return renderCourseItem(course, index);
  });

  return (
    <div className="enroll-container">
      <div className="enroll-subHeader">
        <h1>Enroll from below courses</h1>
      </div>
      <ul className="course-list-view">{renderCourseList}</ul>
      {loading && <Spinner />}
    </div>
  );
}

export default Enroll;
