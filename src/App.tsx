import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { Suspense } from "react";

const Home = React.lazy(() => import("./pages/home"));
const WindowsClient = React.lazy(() => import("./pages/windowsClient"));
const Whiteboard = React.lazy(() => import("./pages/Whiteboard"));

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
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/windows" element={<WindowsClient />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;
