
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Meetings from "./pages/Meetings.jsx";
import MeetingRoom from "./pages/MeetingRoom.jsx";
import Workspace from "./pages/Workspace.jsx";
import Login from "./pages/Login.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/navbar.jsx";

import "./App.css";

function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages that share Sidebar and Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/workspace" element={<Workspace />} />
        </Route>

        {/* Standalone pages */}
        <Route
          path="/meeting-room"
          element={<MeetingRoom />}
        />

        <Route path="/login" element={<Login />} />

        {/* Unknown URLs return to Dashboard */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
