//AKA 403 Page
// import { useLocation } from 'react-router-dom';
import './Forbidden.css';

function Forbidden() {
  // let location = useLocation();

  // if we want to tell user where they came from
  // let from = location.state?.from?.pathname || '/';

  return (
    <>
        <div className="courses-container">
              <div className="courses-heading-container">
                <h1 className="courses-header">403: Forbidden</h1>
              </div>
        </div>
    </>
  );
}

export default Forbidden;
