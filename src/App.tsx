import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/home";
import WindowsClient from "./pages/windowsClient";

const App = () => (
  <Router>
    <nav>
      <ul>
        <li>
          <Link to="/">Word Document Generator</Link>
        </li>
        <li>
          <Link to="/windows">Windows Client Two-Way Communication</Link>
        </li>
        <li>
          <Link to="/electron">Electron Two-Way Communication</Link>
        </li>
      </ul>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/windows" element={<WindowsClient />} />
    </Routes>
  </Router>
);

export default App;
