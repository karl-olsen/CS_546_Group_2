import axios from 'axios';
import homework from '../../assets/Assignments/homework.png';
import userIcon from '../../assets/Login/user.svg';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import './CreateAssignment.css';
import { useEffect, useState } from 'react';
import env from '../../env';
import { toast } from 'react-toastify';

function validateInput(string, fieldName)  {
  if (!string) throw new Error(fieldName + ' is undefined or null, please provide input.');
  if (typeof string !== 'string') throw new Error(fieldName + ' must be of type string.');
  if (string.length === 0) throw new Error(fieldName + ' must be greater than 0 in length.');
  if (!string.trim().length) throw new Error(fieldName + ' contained only whitespace.');
};

function CreateAssignment() {
    const { id } = useParams();
    let location = useLocation();
    const notifyError = (message) => toast.error(message);
    const notifySuccess = (message) => toast.success(message);

    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentType, setAssignmentType] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const user = JSON.parse(localStorage.user);

    // if we want to tell user where they came from
    let from = location.state?.from?.pathname || '/';

    async function handleSubmit(e) {
        e = e || window.event;
        e.preventDefault();

       try{
          validateInput(assignmentName, "Assignment name");
          validateInput(assignmentType, "Assignment type");
          validateInput(assignmentDesc, "Assignment description");

          await axios.post(`${env?.apiUrl}/assignments/${id}`, {
            name: assignmentName,          
            type: assignmentType,
            description: assignmentDesc
          });

          setIsSuccessful(true);
          notifySuccess('Assignment created successfully!');

          //reset the fields on the page
          setAssignmentName('');
          setAssignmentType('');
          setAssignmentDesc('');

        } catch(e) {
          notifyError(e.toString() || 'Unable to create the assignment. Try again!');
        }
    }


  return (
    <>
      {user.role === 'teacher' ? (
        <div className="courses-container">
          <div className="courses-wrapper">
            <div className="courses-bogo">
              <div className="logo-container">
                <img className="logo" src={homework} alt="homework" width="200" />
              </div>
              <div className="courses-heading-container">
                <h1 className="courses-header">Create an Assignment</h1>
                <p className="courses-subheader">
                  {!isSuccessful
                    ? `To create an assignment, please fill out the following fields and click "CREATE ASSIGNMENT".`
                    : 'Assignment Created Successfully!'}
                </p>
              </div>
            </div>
            
            <form onSubmit={async (e) => await handleSubmit(e)}>
              <div className="courses-fields-container">
                <label className="visuallyhidden"> Assignment Name </label>
                <div className="position-relative">
                  <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" />
                  <input
                    className="assignment-info-input"
                    required
                    type="text"
                    name="assignmentName"
                    id="assignmentName"
                    placeholder="Assignment Name"
                    // autoComplete="username"
                    value={assignmentName || ''}
                    onChange={(e) => setAssignmentName(e.target.value)}
                  />
                </div>

                <label className="visuallyhidden"> Assignment Type </label>
                <div className="position-relative">
                  <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" />
                  <input
                      className="assignment-info-input"
                      required
                      type="text"
                      name="assignmentType"
                      id="assignmentType"
                      placeholder="Assignment Type"
                      // autoComplete="username"
                      value={assignmentType || ''}
                      onChange={(e) => setAssignmentType(e.target.value)}
                  />
                </div>

                <label className="visuallyhidden"> Assignment Description </label>
                <div className="position-relative">
                  <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" />
                  <input
                      className="assignment-info-input"
                      required
                      type="text"
                      name="assignmentDescription"
                      id="assignmentDescription"
                      placeholder="Assignment Description"
                      // autoComplete="username"
                      value={assignmentDesc || ''}
                      onChange={(e) => setAssignmentDesc(e.target.value)}
                  />
                </div>

                                            
              </div>

              <div className="assignment-snackbar">
                  <button className="btn-primary" type="submit" onClick={() => {}}>
                  Create Assignment
                  </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
      <div>403 Unauthorized.</div>
      )}
    </>
  );
}


export default CreateAssignment;
