// Import the necessary react hooks, navigation functions, styling and Firebase funtions
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from '../Firebase'
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

//Login functional component
function Login() {

  //Declare State variables:
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useAuthState hook is used to declare user and loading state from Firebase
  const [user, loading] = useAuthState(auth);

  // useNavigate hook is used to declare navigate function for navigation
  const navigate = useNavigate();

  //
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, loading]);

  //JSX structure of Login page
  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Login;