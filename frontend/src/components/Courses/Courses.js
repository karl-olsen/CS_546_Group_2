import axios from 'axios';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import whiteboard from '../../assets/Courses/whiteboard.png';
import userIcon from '../../assets/Login/user.svg';
import './Assignments.css';
import { useEffect, useState } from 'react';
import './Create.css';
import './Courses.css';
import env from '../../env';

function Courses() {
  const { id } = useParams();
  let location = useLocation();
  const user = JSON.parse(localStorage.user);
  const [courseName, setCourseName] = useState('');
  const [userIsEnrolled, setUserIsEnrolled] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isError, setIsError] = useState(false);

  // if we want to tell user where they came from
  let from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e = e || window.event;
    e.preventDefault();
  }

  const enroll = async () => {
    const data = {
      userId: user.id,
      courseId: id,
    };
    try {
      await axios.post(`${env?.apiUrl}/enroll`, data);
      setIsSuccessful(true);
    } catch (error) {
      console.log(error);
    }
  };

  const drop = async () => {
    const data = {
      userId: user.id,
      courseId: id,
    };
    try {
      await axios.post(`${env?.apiUrl}/drop`, data);
      setIsSuccessful(true);
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const isEnrolled = async () => {
    const course = await axios.get(`${env?.apiUrl}/courses/single/${id}`);
    console.log(course.data);
    let enrolled = false;
    course.data.students.forEach((student) => {
      console.log(student.toString());
      if (student.toString() === user.id) {
        console.log(student.toString());
        enrolled = true;
      }
    });
    course.data.teachers.forEach((teacher) => {
      console.log(teacher.toString());
      if (teacher.toString() === user.id) {
        console.log(teacher.toString());
        enrolled = true;
      }
    });
    return enrolled;
  };

  useEffect(async () => {
    const course = await axios.get(`${env?.apiUrl}/courses/single/${id}`);
    const _isEnrolled = await isEnrolled();
    setCourseName(course.data.name);
    setUserIsEnrolled(_isEnrolled);
  }, []);

  return (
    <>
      <div className="courses-container1">
        {!userIsEnrolled ? (
          <>
            <div className="courses-heading-container">
              <h1 className="courses-header">Enroll in {courseName}</h1>
            </div>
            {isSuccessful && <p className="courses-subheader">Succesfully Enrolled!</p>}
            <button className="button" onClick={async () => await enroll()}>
              <p className="button-text">Enroll!</p>
            </button>
          </>
        ) : (
          <>
            <div className="courses-heading-container">
              <h1 className="courses-header">Drop {courseName}</h1>
            </div>
            {isSuccessful && <p className="courses-subheader">Succesfully Dropped!</p>}
            <button className="button" onClick={async () => await drop()}>
              <p className="button-text">Drop!</p>
            </button>
          </>
        )}
        {isError && <p className="courses-subheader">Page needs to be refreshed!</p>}
      </div>
    </>
  );
}

export default Courses;
