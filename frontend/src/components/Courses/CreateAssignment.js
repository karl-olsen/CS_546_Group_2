import axios from 'axios';
import whiteboard from '../../assets/Courses/whiteboard.png';
import userIcon from '../../assets/Login/user.svg';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import './CreateAssignment.css';
import { useEffect, useState } from 'react';
import env from '../../env';

function CreateAssignment() {
    const { id } = useParams();
    let location = useLocation();

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
    
        await axios.post(`${env?.apiUrl}/assignments/${id}`, {
          name: assignmentName,          
          type: assignmentType,
          description: assignmentDesc
        });
        setIsSuccessful(true);
      }


    return (
        <>
        {user.role === 'teacher' ? (
        <div className="courses-container">
          <div className="courses-wrapper">
            <div className="courses-bogo">
              <div className="logo-container"></div>
              <div className="courses-heading-container">
                <h1 className="courses-header">Create a course</h1>
                <p className="courses-subheader">
                  {!isSuccessful
                    ? `To create an assignment, please fill out the following fields and click "CREATE ASSIGNMENT".`
                    : 'Assignment Created Successfully!'}
                </p>
              </div>
                <form onSubmit={async (e) => await handleSubmit(e)}>
                    <div className="courses-fields-container">
                        {/* <label className="visuallyhidden">Course Name</label> */}
                        <label> Assignment Name </label>
                        <div className="position-relative">
                        {/* <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" /> */}
                        <input
                            className="assignment-name-input"
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

                        <label> Assignment Type </label>
                        <div className="position-relative">
                        {/* <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" /> */}
                        <input
                            className="assignment-type-input"
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

                        <label> Assignment Description </label>
                        <div className="position-relative">
                        {/* <img className="input-icon" src={userIcon} alt="user stroke icon" aria-hidden="true" /> */}
                        <input
                            className="assignment-description-input"
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
        </div>
        ) : (
        <div>403 Unauthorized.</div>
      )}
        </>
      );
}


export default CreateAssignment;
