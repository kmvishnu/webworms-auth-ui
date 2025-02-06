import {
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";

import LoginComponent from "./Components/LoginComponent/LoginComponent";
import RegisterComponent from "./Components/RegisterComponent/RegisterComponent";
import ForgotPassword from "./Components/ForgotPassword/ForgotPasswordComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="register" element={<RegisterComponent />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
