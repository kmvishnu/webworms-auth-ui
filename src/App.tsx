import {
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";

import LoginComponent from "./Components/LoginComponent/LoginComponent";
import RegisterComponent from "./Components/RegisterComponent/RegisterComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="register" element={<RegisterComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
