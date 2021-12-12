import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import env from '../../env';
import './Dashboard.css';
import Spinner from '../Spinner/Spinner';

function Dashboard() {
  let [dashboardData, setDashboardData] = useState([]);
  let [error, setError] = useState(false);
  let [errorMsg, setErrorMsg] = useState('');
  let [loading, setLoading] = useState(true);
  const user = localStorage.user && JSON.parse(localStorage.user);

  useEffect(() => {
    (async () => {
      await axios
        .get(`${env.apiUrl}/courses/${user.id}`)
        .then((response) => {
          setError(false);
          setDashboardData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          let errorMsgL = typeof error === 'string' ? error : error.message ? error.message : 'Something went wrong';
          setError(true);
          setErrorMsg(errorMsgL);
          toast.error(errorMsgL);
          setLoading(false);
        });
    })();
  }, []);

  const renderCourse = (course, index) => {
    const gradientClass = 'course-grade-lg' + (index % 10);
    return (
      <a className="course-element-container" key={index} href={`/courses/${course._id.toString()}`}>
        <div className={`course-grade-container ${gradientClass}`}>
          {user && user.role !== 'teacher' && <div className="course-grade-circle">{course.grade}%</div>}
        </div>
        <div className="course-element">{course.name}</div>
      </a>
    );
  };

  const gridCourses = dashboardData.map((course, idx) => {
    return renderCourse(course, idx);
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-subHeader">
        <h1>Dashboard</h1>
      </div>
      <div className="grid-container">{gridCourses}</div>
      {error ? <div>{errorMsg}</div> : null}
      {loading && <Spinner />}
    </div>
  );
}

export default Dashboard;
