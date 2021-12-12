import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';
import './Enroll.css';

function GradeAssignment(props) {
  const [grades, setGrades] = useState([]);
  const [grade, updateGradeState] = useState('');
  const [editGrade, setEditGrade] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllGrades = async () => {
    await axios
      .get(`${props.env?.apiUrl}/assignments/grades/all/${props.assignmentId}`)
      .then((response) => {
        setLoading(false);
        setGrades(response.data.grades);
        console.log(response);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error && error.message);
        props.notify(
          error && error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : 'Unable to fetch grades. Please try again letter'
        );
      });
  };

  useEffect(() => {
    (async () => {
      await fetchAllGrades();
    })();
  }, []);

  const updateGrade = async (studentId, grade) => {
    try {
      if(parseInt(grade) < 0 || parseInt(grade) > 100) throw new Error('Grade must be between 0 and 100!');
      
      setEditGrade(false);
      await axios
        .patch(`${props.env?.apiUrl}/assignments/grades/${props.assignmentId}`, {
          teacherId: props.teacherId,
          studentId: studentId,
          grade: grade,
          courseId: props.courseId,
        })
        .then((response) => {
          (async () => {
            await fetchAllGrades();
            await props.fetchGradeMetrics();
          })();
          console.log(response);
          props.notifySuccess('Grade updated!');
        })
        .catch((error) => {
          console.log(error && error.message);
          props.notify('Unable to update grade!');
        });

    } catch(e) {
      props.notify(e.toString() || 'Invalid grade value. Try again!');
    }    
  };

  const renderGradeItem = (user, index) => {
    return (
      <li className="enroll-course-container" key={index}>
        <div className="enroll-course-name">
          {user.firstName} {user.lastName}
        </div>
        <label>
          <span className="gradeSpan">Grade:</span>
          <input
            className="input-grade-field"
            disabled={!editGrade}
            value={editGrade ? grade : user.grade === -1 ? 'N/A' : user.grade}
            onChange={(e) => updateGradeState(e.target.value)}
          />
        </label>
        <button className="enroll-button" onClick={() => setEditGrade(true)}>
          Edit
        </button>
        <button className="enroll-button" onClick={async () => await updateGrade(user && user._id, grade)}>
          Update
        </button>
      </li>
    );
  };

  const renderGradesList =
    grades &&
    grades.map((user, index) => {
      return renderGradeItem(user, index);
    });

  return (
    <div>
      {loading && <Spinner />}
      <div className="enroll-container">
        {grades.length > 0 ? (
          <>
            <div className="enroll-subHeader">
              <h1>View or Update Grades</h1>
            </div>
            <div className="assignment-container" style={{ marginTop: '30px' }}>
              <h2>Grade Metrics</h2>
              <div className="courses-assignment-container" style={{ justifyContent: 'space-evenly' }}>
                <div>Minimum</div>
                <div>Maximum</div>
                <div>Average</div>
              </div>
              <div className="courses-assignment-container" style={{ justifyContent: 'space-evenly' }}>
                <div>{props.metrics.min !== -1 ? props.metrics.min : 'N/A'}</div>
                <div>{props.metrics.max !== -1 ? props.metrics.max : 'N/A'}</div>
                <div>{props.metrics.average !== -1 ? props.metrics.average : 'N/A'}</div>
              </div>
            </div>
            <h2>Student Grades</h2>
            <ul className="course-list-view">{renderGradesList}</ul>
          </>
        ) : (
          <div className="enroll-subHeader" style={{ justifyContent: 'center', border: 'none' }}>
            <h1>No assignments have been submitted yet</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default GradeAssignment;
