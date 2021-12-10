import axios from 'axios';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import './Assignment.css';
import './Assignments.css';
import { useEffect, useState } from 'react';
import './Create.css';
import env from '../../env';
import { toast } from 'react-toastify';

function Assignments() {
  const { id, assignmentId } = useParams();
  const notify = (message) => toast.error(message);
  let location = useLocation();
  const user = JSON.parse(localStorage.user);
  const [courseName, setCourseName] = useState('');
  const [assignment, setAssignment] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [grade, setGrade] = useState('');
  const [metrics, setMetrics] = useState([]);
  const [isError, setIsError] = useState(false);

  // if we want to tell user where they came from
  let from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e = e || window.event;
    e.preventDefault();
    // setIsFilePicked(true);
    await uploadFile();
  }

  async function uploadFile() {
    if (!selectedFile) {
      notify('You must upload a file');
      return;
    }
    const data = new FormData();
    console.log('selected ', selectedFile);
    data.append('studentId', user.id);
    data.append('assignmentId', assignmentId);
    data.append('file', selectedFile);
    try {
      await axios.post(`${env?.apiUrl}/submit`, data);
    } catch (e) {
      notify(e?.response?.data?.error || 'Unable to upload file');
    }
  }

  useEffect(() => {
    (async () => {
      const assignments = await axios.get(`${env?.apiUrl}/assignments/${id}`);
      if (assignments.status !== 200) {
        setIsError(true);
        return;
      }
      const _assignment = assignments.data.find((assignment) => assignment._id.toString() === assignmentId);
      setAssignment(_assignment);
    })();
  }, []);

  useEffect(async () => {
    const _grade = await axios.get(`${env?.apiUrl}/assignments/grades/${assignmentId}?studentId=${user.id}`);
    if (_grade.status === 200) {
      setGrade(_grade.data.grade);
    }
  }, []);

  useEffect(async () => {
    try {
      const _metrics = await axios.get(`${env?.apiUrl}/assignments/grades/metrics/${assignmentId}`);
      setMetrics(_metrics.data.grades);
    } catch (e) {
      setMetrics(null);
    }
  }, []);
  return (
    <>
      <div className="courses-container">
        <div className="courses-heading-container">
          <h1 className="courses-header">View and Submit Your Assigment!</h1>
        </div>
        <div className="assignment-container">
          <div className="courses-assignment-container">
            <div className="assignment-grade-type bold">Type</div>
            <div className="assignment-grade-name bold">Name</div>
            <div className="assignment-grade-description bold">Description</div>
            <div className="assignment-grade-description bold">Grade</div>
          </div>
          <div className="courses-assignment-container">
            <div className="assignment-grade-type">{assignment.type}</div>
            <div className="assignment-grade-name">{assignment.name}</div>
            <div className="assignment-grade-description">{assignment.description}</div>
            <div className="assignment-grade-grade">{grade && grade !== -1 ? grade : 'n/a'}</div>
          </div>
        </div>
        {metrics && (
          <div className="assignment-container">
            <div className="courses-assignment-container">
              <div className="assignment-grade-min bold">Min</div>
              <div className="assignment-grade-max bold">Max</div>
              <div className="assignment-grade-avg bold">Avg</div>
            </div>
            <div className="courses-assignment-container">
              <div className="assignment-grade-min">{metrics.min}</div>
              <div className="assignment-grade-max">.{metrics.max}</div>
              <div className="assignment-grade-avg">{metrics.average}</div>
            </div>
          </div>
        )}
        <div className="submit-container">
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              name="file"
              id="chooseFile"
              title="Upload File"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <div>
              <button type="submit" id="submitFile">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="courses-options-container"></div>
      </div>
    </>
  );
}

export default Assignments;
