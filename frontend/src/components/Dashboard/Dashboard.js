import exportedObj from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import env from '../../env';
import './Dashboard.css';

function Dashboard() {
  let auth = exportedObj.useAuth();
  let navigate = useNavigate();
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

  async function logout(e) {
    e.preventDefault();

    await auth.signout(() => {
      navigate('/logout');
    });
  }

  const enrollOnClick = () => {
    navigate('/courses/enroll');
  };

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
      <button onClick={enrollOnClick}>Enroll in a course</button>
      <div className="grid-container">{gridCourses}</div>
      {error ? <div>{errorMsg}</div> : null}
      <button onClick={async (e) => await logout(e)}>Logout</button>
    </div>
  );
}

export default Dashboard;
