import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const handleLogin = async (payload) => {
    setError("");

    try {
      await login(payload);
      showToast({ type: "success", title: "Welcome back" });
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(err.message);
      showToast({ type: "error", title: "Login failed", message: err.message });
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} error={error} />;
};

export default Login;
