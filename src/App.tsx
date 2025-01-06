import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { Suspense } from "react";

const Home = React.lazy(() => import("./pages/home"));
const WindowsClient = React.lazy(() => import("./pages/windowsClient"));
const Whiteboard = React.lazy(() => import("./pages/whiteboard/index"));

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
          <Link to="/whiteboard">Custom Excalidraw</Link>
        </li>
      </ul>
    </nav>
    <div style={{ padding: "20px" }}>
      <Suspense fallback={<div style={{ margin: "20px 0" }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/windows" element={<WindowsClient />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
        </Routes>
      </Suspense>
    </div>
  </Router>
);

export default App;
