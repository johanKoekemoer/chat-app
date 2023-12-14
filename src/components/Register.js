// Import the necessary react hooks, navigation functions, styling and Firebase funtions
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from "../Firebase";
import "./Register.css";

// Register functional component
function Register() {

  // Declare state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // Declare user and loading variables from the useAuthState hook
  const [user, loading] = useAuthState(auth);

  // Declare navigate function
  const navigate = useNavigate();

  // register function checks if all fields are valid and then calls registerWithEmailAndPassword
  const register = () => {
    if (name === "") return alert("Please enter name");
    // Email and password checks are validated by Firebase itself and will prompt alert message if necessary
    registerWithEmailAndPassword(name, email, password, profilePicture);
  };

  // Calls the setProfilePicture method from Firebase.js which uploaods the profile picture to Firebase storage
  const profilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  // If somehow user navigates to `/register` while being logged in then user is navigated to `/dashboard`
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  // JSX structure for Register page
  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-mail Address"
        />
        Set Profile Picture <input
          type="file"
          className="register_pictureInput"
          id="profilePictureInput"
          accept="image/*"
          onChange={profilePictureChange}
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}
        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Register;
