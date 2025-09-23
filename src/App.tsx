import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { Suspense } from "react";

const Home = React.lazy(() => import("./pages/home"));
const Clients = React.lazy(() => import("./pages/clients"));
const Whiteboard = React.lazy(() => import("./pages/whiteboard/index"));
const SpinWheel = React.lazy(() => import("./pages/SpinWheel/index"));
const IframeGameTest = React.lazy(() => import("./pages/iframeGameTest/index"));

const App = () => (
  <Router>
    <nav>
      <ul>
        <li>
          <Link to="/">Word Document Generator</Link>
        </li>
        <li>
          <Link to="/clients">Clients Two-Way Communication</Link>
        </li>
        <li>
          <Link to="/whiteboard">Custom Excalidraw</Link>
        </li>
        <li>
          <Link to="/spinwheel">Spin Wheel</Link>
        </li>
        <li>
          <Link to="/iframe-game-test">Iframe Game Test</Link>
        </li>
      </ul>
    </nav>
    <Suspense
      fallback={
        <div style={{ margin: "20px 0", padding: "20px" }}>Loading...</div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "20px" }}>
              <Home />
            </div>
          }
        />
        <Route
          path="/clients"
          element={
            <div style={{ padding: "20px" }}>
              <Clients />
            </div>
          }
        />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/spinwheel" element={<SpinWheel />} />
        <Route path="/iframe-game-test" element={<IframeGameTest />} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;
