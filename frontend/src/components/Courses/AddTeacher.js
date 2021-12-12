import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import env from '../../env';
//effectively uses same page as Enroll so can just use the same .css
import './Enroll.css';
import Spinner from '../Spinner/Spinner';

function AddTeacher() {
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

  const addTeacher = async (courseId) => {
    await axios
      .patch(`${env.apiUrl}/courses/`, {
        userId: user.id,
        courseId: courseId,
      })
      .then((response) => {
        notifySuccess('Successfully added self as a teacher to the course!');
      })
      .catch((res) => {
        console.log(res);
        notifyError(res?.response?.data?.error || 'Unable to add self as a teacher to the course. Try again!');
      });
  };

  const renderCourseItem = (course, index) => {
    return (
      <li className="enroll-course-container" key={index}>
        <div className="enroll-course-name">{course.courseName}</div>
        <button className="enroll-button" onClick={async () => addTeacher(course.courseId)}>
          Join as Teacher
        </button>
      </li>
    );
  };

  const renderCourseList = courseList.map((course, index) => {
    console.log(JSON.parse(localStorage.user));
    return renderCourseItem(course, index);
  });

  return (
    <div className="enroll-container">
      <div className="enroll-subHeader">
        <h1>Add yourself as a teacher from the below courses</h1>
      </div>
      <ul className="course-list-view">{renderCourseList}</ul>
      {loading && <Spinner />}
    </div>
  );
}

export default AddTeacher;
