import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';
import './Enroll.css';
import { toast } from 'react-toastify';
import env from '../../env';

function GradeAssignment(props) {
  const [grades, setGrades] = useState([]);
  const [grade, updateGradeState] = useState({});
  const [editGrade, setEditGrade] = useState({});
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState();
  const notify = (message) => toast.error(message);

  const fetchAllGrades = async () => {
    await axios
      .get(`${props.env?.apiUrl}/assignments/grades/all/${props.assignmentId}`)
      .then((response) => {
        setLoading(false);
        setGrades(response.data.grades);
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

  const fetchSubmissions = async () => {
    try {
      const submissions = await axios.get(`${env?.apiUrl}/assignments/submissions/${props.assignmentId}`);
      console.log(submissions);
      setSubmissions(submissions.data);
    } catch (e) {
      notify(e?.response?.data?.error || 'No submissions found / Unable to get submissions');
    }
  };

  useEffect(() => {
    (async () => {
      await fetchSubmissions();
      await fetchAllGrades();
    })();
  }, []);

  const updateGrade = async (studentId, grade, idx, existingGrade) => {
    if (!grade || grade.trim() === '' || parseInt(grade) < 0 || parseInt(grade) > 100) {
      props.notify('Please enter valid grade!');
    } else if (existingGrade.toString() === grade) {
      props.notify('Please modify grade to update!');
    } else {
      await axios
        .patch(`${props.env?.apiUrl}/assignments/grades/${props.assignmentId}`, {
          teacherId: props.teacherId,
          studentId: studentId,
          grade: grade,
          courseId: props.courseId,
        })
        .then((response) => {
          setInputEnable(idx, true);
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
    }
  };

  const setInputEnable = (idx, bool) => {
    let inputs = Object.assign({}, editGrade);
    inputs[idx] = bool;
    setEditGrade(inputs);
  };

  const setInputValue = (e, idx) => {
    e.preventDefault();
    const { name, value } = e.target;
    let values = Object.assign({}, grade);
    values[idx] = value;
    updateGradeState(values);
  };

  const renderSubmission = (user) => {
    const result = submissions?.find((submission) => user._id === submission?.studentId);
    return result?.filename;
  };

  const renderGradeItem = (user, index) => {
    const submissionFileName = renderSubmission(user);
    return (
      <li className="enroll-course-container" key={index}>
        <div className="enroll-course-name">
          {user.firstName} {user.lastName}
        </div>
        <span>Submission: {submissionFileName}</span>
        <label>
          <span className="gradeSpan">Grade:</span>
          <input
            name={index}
            className="input-grade-field"
            disabled={editGrade[index] === undefined ? true : editGrade[index]}
            value={editGrade[index] !== undefined ? grade[index] : user.grade === -1 ? 'N/A' : user.grade}
            onChange={(e) => setInputValue(e, index)}
          />
        </label>
        <button className="enroll-button" onClick={() => setInputEnable(index, false)}>
          Edit
        </button>
        <button
          className="enroll-button"
          onClick={async () => await updateGrade(user && user._id, grade[index], index, user.grade)}
        >
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
                <div>{props.metrics?.min !== -1 ? props.metrics?.min : 'N/A'}</div>
                <div>{props.metrics?.max !== -1 ? props.metrics?.max : 'N/A'}</div>
                <div>{props.metrics?.average !== -1 ? props.metrics?.average : 'N/A'}</div>
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
