import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import RoomDetails from "./pages/RoomDetails";

const AdminRoute = ({ children }) => {
  const userType = localStorage.getItem("userType");
  if (userType !== "admin") {
    return <Navigate to="/rooms" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route
            path="/bookings"
            element={
              <AdminRoute>
                <Bookings />
              </AdminRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
