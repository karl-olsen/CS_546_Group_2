import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import { Routes, Route, Outlet } from 'react-router-dom';
import exportedObj from './providers/AuthProvider';

function App() {
  return (
    <exportedObj.AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Since auth doesnt work yet you can just test it by following it here */}

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
