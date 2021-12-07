import axios from 'axios';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import whiteboard from '../../assets/Courses/whiteboard.png';
import userIcon from '../../assets/Login/user.svg';
import './Assignment.css';
import './Assignments.css';
import { useEffect, useState } from 'react';
import './Create.css';
import env from '../../env';

function Assignments() {
  const { id, assignmentId } = useParams();
  let location = useLocation();
  const user = JSON.parse(localStorage.user);
  const [courseName, setCourseName] = useState('');
  const [assignment, setAssignment] = useState([]);
  const [grade, setGrade] = useState('');
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
    const _assignment = assignments.data.find((assignment) => assignment._id.toString() === assignmentId);
    setAssignment(_assignment);
    const _grade = await axios.get(`${env?.apiUrl}/assignments/grades/${assignmentId}?studentId=${user.id}`);
    setGrade(_grade);
  }, []);

  return (
    <>
      <div className="courses-container">
        <div className="courses-heading-container">
          <h1 className="courses-header">View and Submit Your Assigment!</h1>
        </div>
        <div className="assignment-container">
          <div className="courses-assignment-container">
            <div className="assignment-type bold">Type</div>
            <div className="assignment-name bold">Name</div>
            <div className="assignment-description bold">Description</div>
          </div>
          <div className="courses-assignment-container">
            <div className="assignment-type">{assignment.type}</div>
            <div className="assignment-name">{assignment.name}</div>
            <div className="assignment-description">{assignment.description}</div>
          </div>
        </div>

        <div className="courses-options-container"></div>
      </div>
    </>
  );
}

export default Assignments;
