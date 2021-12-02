import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import exportedObj from '../../providers/AuthProvider';

function Login() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = exportedObj.useAuth();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // if we want to tell user where they came from
  let from = location.state?.from?.pathname || '/';

  async function handleSubmit(event) {
    event.preventDefault();

    // Check input fields

    await auth.signin({ email, password }, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    });
  }

  return (
    <div>
      <form onSubmit={async (e) => await handleSubmit(e)}>
        <label>
          Email:
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="text" onChange={(e) => setPassword(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Login;
