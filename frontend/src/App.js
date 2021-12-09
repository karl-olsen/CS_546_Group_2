import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Create from './components/Courses/Create';
import Assignments from './components/Courses/Assignments';
import CreateAssignment from './components/Courses/CreateAssignment';
import Dashboard from './components/Dashboard/Dashboard';
import Courses from './components/Courses/Courses';
import { Routes, Route, Outlet } from 'react-router-dom';
import exportedObj from './providers/AuthProvider';
import axios from 'axios';
import env from './env';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Logout from './components/Logout/Logout';
import Signup from './components/Signup/Signup';
import Enroll from './components/Courses/Enroll';
import Forbidden from './components/Courses/Forbidden';

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url);
    const allowedOrigins = [env.apiUrl];
    const token = localStorage.getItem('token');
    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <exportedObj.AuthProvider>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/signup"
          element={
            <exportedObj.RequireUnAuth>
              <Signup />
            </exportedObj.RequireUnAuth>
          }
        />

        <Route path="/logout" element={<Logout />} />

        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <exportedObj.RequireAuth>
                <Dashboard />
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <exportedObj.RequireAuth>
                <Dashboard />
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/courses/create"
            element={
              <exportedObj.RequireAuth>
                <Create />
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <exportedObj.RequireAuth>
                <Courses />
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/courses/:id/assignments"
            element={
              <exportedObj.RequireAuth>
                <Assignments />
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/courses/:id/assignments/create"
            element={
              <exportedObj.RequireAuth>
                <CreateAssignment />
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/courses/enroll"
            element={
              <exportedObj.RequireAuth>
                <Enroll />
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/403"
            element={
              <exportedObj.RequireAuth>
                <Forbidden />
              </exportedObj.RequireAuth>
            }
          />
          {/* Put the rest of your auth routes here follow the syntax */}
        </Route>
      </Routes>
    </exportedObj.AuthProvider>
  );
}

function Layout() {
  return (
    <div>
      <Navbar />
      {/* React Router Outlet */}
      <Outlet />
    </div>
  );
}

export default App;
