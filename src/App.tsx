import { BrowserRouter as Router } from "react-router-dom"; // Single Router
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
