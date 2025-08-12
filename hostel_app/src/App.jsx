import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";

function App() {
  return (
    <Router>
      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
