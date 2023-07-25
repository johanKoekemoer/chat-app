// Import the necessary react hooks, navigation functions, styling and Firebase funtions
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../Firebase";
import "./Reset.css";

// the Reset functional component
function Reset() {

  // Declare state variables
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);

  // Declare navigate function
  const navigate = useNavigate();

  // useEffect function that will navigate to `/dashboard` if the user is logged in
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  // When reset password is clicked, sendPasswordReset function is called and the email input is cleared
  const handleResetPassword = () => {
    sendPasswordReset(email);
    setEmail("");
  };

  // JSX structure for Reset component
  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button className="reset__btn" onClick={handleResetPassword}>
          Send password reset email
        </button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Reset;
