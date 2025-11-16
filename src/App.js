import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Canvas from './components/Canvas.jsx';
import Calendar from './pages/Calendar.jsx';
import GetInvolved from './pages/GetInvolved.jsx';
import WhoWeAre from './pages/WhoWeAre.jsx';  

function App() {
  return (
    <Router>
      <Routes>
        {/* Main home page with the fish */}
        <Route path="/" element={<Canvas />} />

        {/* Calendar page */}
        <Route path="/calendar" element={<Calendar />} />

        {/* Get Involved page */}
        <Route path="/get-involved" element={<GetInvolved />} />

        {/* Who We Are page */}
        <Route path="/about" element={<WhoWeAre />} />
      </Routes>
    </Router>
  );
}

export default App;