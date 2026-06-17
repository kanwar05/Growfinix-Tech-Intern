import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";

const Signup = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignup = async (payload) => {
    setError("");

    try {
      await signup(payload);
      showToast({ type: "success", title: "Account created" });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      showToast({ type: "error", title: "Signup failed", message: err.message });
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSignup} error={error} />;
};

export default Signup;
