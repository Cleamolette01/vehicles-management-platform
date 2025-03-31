import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import beevLogo from "./assets/beev.svg";
import "./App.css";
import DashboardOverview from "./components/DashboardOverview";
import VehicleManagement from "./components/VehicleManagement";
import AnalyticsVisualization from "./components/AnalyticsVisualization";


function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <a href="https://beev.co" target="_blank">
          <img src={beevLogo} className="logo w-16 h-16" alt="Beev logo" />
        </a>
        <h1 className="text-4xl font-bold">Beev Homework</h1>

        {/* Navigation */}
        <nav className="flex gap-4">
          <NavLink to="/" className="text-blue-500 hover:underline">
            Home
          </NavLink>
          <NavLink to="/dashboard" className="text-blue-500 hover:underline">
            Dashboard Overview
          </NavLink>
          <NavLink to="/analytics" className="text-blue-500 hover:underline">
            Analytics Visualization
          </NavLink>
          <NavLink to="/vehicles" className="text-blue-500 hover:underline">
            Vehicle Management
          </NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/analytics" element={<AnalyticsVisualization />} />
          <Route path="/vehicles" element={<VehicleManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="text-lg">
    <p>Welcome on home page !</p>
  </div>
);

export default App;
