// import { styles } from './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/dashboard">Protected Page</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
