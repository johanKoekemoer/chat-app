import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, db } from '../Firebase'
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, updateDoc } from "firebase/firestore";
import "./Login.css";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleOnline = async() => {
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { online: true });
    navigate('/chat');
  };

  useEffect(() => {
    if (user) {
      handleOnline();
    };
  }, [user, loading]);
  
  return (
    <div className="login">
      <img src="https://firebasestorage.googleapis.com/v0/b/fireplace-7d903.appspot.com/o/login_logo.png?alt=media&token=a04e805c-e36a-4e3b-9759-87a66ef2d8fc" alt="Your Logo" className="login__logo" />

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
          <p className="text"><Link to="/reset">Forgot Password</Link></p>
        </div>
        <div>
          <p className="text">Don't have an account? <Link to="/register">Register</Link> now.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
