// Import the necessary react hooks, navigation functions, styling and Firebase funtions
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword, signInWithGoogle, db } from "../Firebase";
import { doc, updateDoc } from "@firebase/firestore";
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
    if (password.length < 6) return alert("Password should contain atleast 6 characters")
    if (profilePicture === null) return alert("Please set a profile picture")
    // Email and password checks are validated by Firebase itself and will prompt alert message if necessary
    registerWithEmailAndPassword(name, email, password, profilePicture);
  };

  // Calls the setProfilePicture method from Firebase.js which uploaods the profile picture to Firebase storage
  const profilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  // Once login is detected user is navigated to chat page
  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate('/chat');
    };
  }, [user, loading]);

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
        <p className="text">{profilePicture === null ? "Set Profile Picture" : null}</p>
        <div className="register-pic-container">
        <input
          type="file"
          className={profilePicture === null ? "register_pictureInput" : "register-hidden-input"}
          id="profilePictureInput"
          accept="image/*"
          onChange={profilePictureChange}
        />
        { profilePicture === null ?
        null : 
        <label htmlFor="profilePictureInput"><img className="register-img"
        src={URL.createObjectURL(profilePicture)} /></label>}
        </div>
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
        <div className="text">
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Register;
