import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Create from './components/Courses/Create';
import Assignments from './components/Courses/Assignments';
import Assignment from './components/Courses/Assignment';
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
import AddTeacher from './components/Courses/AddTeacher';
import Forbidden from './components/Error/Forbidden';
import Error404 from './components/Error/Error404';

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

        <Route path="/signup" element={<Signup />} />

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
                <exportedObj.RequireTeacher>
                  <Create />
                </exportedObj.RequireTeacher>
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
                <exportedObj.RequireTeacher>
                  <CreateAssignment />
                </exportedObj.RequireTeacher>
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/courses/enroll"
            element={
              <exportedObj.RequireAuth>
                <exportedObj.RequireStudent>
                  <Enroll />
                </exportedObj.RequireStudent>
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/courses/:id/assignments/:assignmentId"
            element={
              <exportedObj.RequireAuth>
                <Assignment />
              </exportedObj.RequireAuth>
            }
          />
          <Route
            path="/courses/AddTeacher"
            element={
              <exportedObj.RequireAuth>
                <exportedObj.RequireTeacher>
                  <AddTeacher />
                </exportedObj.RequireTeacher>
              </exportedObj.RequireAuth>
            }
          />
          <Route path="/403" element={<Forbidden />} />
          {/* Put the rest of your auth routes here follow the syntax */}
        </Route>
        <Route path="*" element={<Error404 />} />
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
