import { useEffect, useState } from 'react';
import axios from 'axios';
import env from '../../env';
import './Dashboard.css';

function Dashboard() {
  let [dashboardData, setDashboardData] = useState([]);
  let [error, setError] = useState(false);
  let [errorMsg, setErrorMsg] = useState('');
  const user = JSON.parse(localStorage.user);

  useEffect(() => {
    (async () => {
      await axios
        .get(`${env.apiUrl}/courses/${user.id}`)
        .then((response) => {
          setError(false);
          setDashboardData(response.data);
        })
        .catch((error) => {
          setError(true);
          // setErrorMsg(error);
        });
    })();
  }, []);

  const renderCourse = (course, index) => {
    const gradientClass = 'course-grade-lg' + (index % 10);
    return (
      <a className="course-element-container" key={index}>
        <div className={`course-grade-container ${gradientClass}`}>
          <div className="course-grade-circle">{course.grade}</div>
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
    </div>
  );
}

export default Dashboard;
