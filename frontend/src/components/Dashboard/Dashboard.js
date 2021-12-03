import exportedObj from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  let auth = exportedObj.useAuth();
  let navigate = useNavigate();

  async function logout(e) {
    e.preventDefault();

    await auth.signout(() => {
      navigate('/404');
    });
  }

  return (
    <>
      <h1>I am Dashboard</h1>
      <button onClick={async (e) => await logout(e)}>Logout</button>
    </>
  );
}

export default Dashboard;
