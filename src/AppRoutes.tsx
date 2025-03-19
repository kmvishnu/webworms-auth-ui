import { Route, Routes, useSearchParams } from "react-router-dom";
import LoginComponent from "./Components/LoginComponent/LoginComponent";
import RegisterComponent from "./Components/RegisterComponent/RegisterComponent";
import ForgotPassword from "./Components/ForgotPassword/ForgotPasswordComponent";

function AppRoutes() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("client_id") || "";
  const redirectUri = searchParams.get("redirect_uri") || "";

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginComponent clientId={clientId} redirectUri={redirectUri} />
        }
      />
      <Route path="/register" element={<RegisterComponent />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="*"
        element={
          <LoginComponent clientId={clientId} redirectUri={redirectUri} />
        }
      />
    </Routes>
  );
}

export default AppRoutes;
