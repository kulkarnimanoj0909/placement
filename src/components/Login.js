import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { auth } from "./firebase"; // Ensure correct import
import { FcGoogle } from "react-icons/fc"; // Google Icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(""); // Message for password reset
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Attempting login...");

    // Admin Login Condition
    if (email === "admin@gmail.com" && password === "sdmcet@taps") {
      console.log("Admin login successful. Navigating to /admin...");
      alert("Admin Login Successful!");

      setTimeout(() => {
        navigate("/admin");
      }, 500);

      setLoading(false);
      return;
    }

    // Student Login
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Student login successful. Navigating to /dashboard...");
      alert("Login Successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error("Login Error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Login failed. Please check your details and try again.");
      }
    }

    setLoading(false);
  };

  // Google Login Function
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-In Successful:", result.user);
      alert("Google Login Successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google Login failed. Please try again.");
    }

    setLoading(false);
  };

  // Forgot Password Function
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setError("");
    setResetMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error("Password Reset Error:", err);
      setError("Failed to send reset email. Please check your email and try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card className="p-4 shadow-lg" style={{ width: "25rem" }}>
          <h2 className="text-center mb-3">Login</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {resetMessage && <Alert variant="success">{resetMessage}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
            </Form.Group>

            <div className="text-end">
              <span style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }} onClick={handleForgotPassword}>
                Forgot Password?
              </span>
            </div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="primary" type="submit" className="w-100 mt-2" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Login"}
              </Button>
            </motion.div>
          </Form>

          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <span style={{ color: "blue", cursor: "pointer", textDecoration: "underline", fontWeight: "bold" }} onClick={() => navigate("/signup")}>
                Register here
              </span>
            </p>
          </div>

          {/* Google Sign-In Button */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button variant="light" className="w-100 mt-2 d-flex align-items-center justify-content-center" onClick={handleGoogleLogin}>
              <FcGoogle size={20} className="me-2" /> Sign in with Google
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Login;
