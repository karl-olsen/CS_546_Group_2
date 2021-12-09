//AKA 403 Page
import axios from 'axios';
import homework from '../../assets/Assignments/homework.png';
import userIcon from '../../assets/Login/user.svg';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import './CreateAssignment.css';
import { useEffect, useState } from 'react';
import env from '../../env';
import { toast } from 'react-toastify';

function CreateAssignment() {
    let location = useLocation();

    // if we want to tell user where they came from
    let from = location.state?.from?.pathname || '/';

  return (
    <>
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
          </div>
        </div>
    </>
  );
}


export default CreateAssignment;
