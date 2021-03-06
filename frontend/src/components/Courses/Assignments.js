import axios from 'axios';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import './Assignments.css';
import { useEffect, useState } from 'react';
import './Create.css';
import env from '../../env';

function Assignments() {
  const { id } = useParams();
  let location = useLocation();
  const user = JSON.parse(localStorage.user);
  const [courseName, setCourseName] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [isError, setIsError] = useState(false);

  // if we want to tell user where they came from
  let from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e = e || window.event;
    e.preventDefault();
  }

  useEffect(async () => {
    const assignments = await axios.get(`${env?.apiUrl}/assignments/${id}`);
    if (assignments.status !== 200) {
      setIsError(true);
      return;
    }
    const course = await axios.get(`${env?.apiUrl}/courses/single/${id}`);
    setAssignments(assignments.data);
    setCourseName(course.data.name);
  }, []);

  return (
    <>
      <div className="courses-container">
        <div className="courses-heading-container">
          <h1 className="courses-header">Assignments for {courseName}</h1>
        </div>
        {assignments.length > 0 ? (
          <div className="assignments-container">
            <div className="courses-assignment-container">
              <div className="assignment-type bold">Type</div>
              <div className="assignment-name bold">Name</div>
              <div className="assignment-description bold">Description</div>
            </div>
            {assignments.map((assignment, index) => (
              <div className="courses-assignment-container" key={index}>
                <div className="assignment-type">{assignment.type}</div>
                <div className="assignment-name">
                  <a href={`http://localhost:3000/courses/${id}/assignments/${assignment._id.toString()}`}>
                    {assignment.name}
                  </a>
                </div>
                <div className="assignment-description">{assignment.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="assignment-description bold assignments-align-centre text-white">
            Currently there are no assignments, relax!
          </div>
        )}

        <div className="courses-options-container"></div>
      </div>
    </>
  );
}

export default Assignments;
