
// Import the necessary react hooks, navigation functions, styling and Firebase funtions
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../Firebase"
import { query, collection, where, getDocs } from "firebase/firestore";


// Dashboard functional component 
function Dashboard() {

  //Declare state variables
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  //Declare navigate function
  const navigate = useNavigate();

  // fetchUserData- Function to fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid)); // Create a Firestore query to fetch user data
      const doc = await getDocs(q); // Execute the query and retrieve the document(s)
      const data = doc.docs[0].data(); // Extract the data from the first document
      setName(data.name); // Set the name state with the retrieved name
      setEmail(data.email); // Set the email state with the retrieved email

    } catch (err) {
      console.error(err); // Log the error to the console
      alert("An error occurred while fetching user data, see console for details"); // Display an error message to the user
    }
  };

  // useEffect that ensures fetchUserData is called only when authentication state is resolved
  useEffect(() => {
    if (loading) return; // If the component is still loading, exit the useEffect early
    if (user===null || user===undefined) return navigate("/"); // If the user is not authenticated, navigate to the login page
    fetchUserData(); // Fetch the user data from Firestore
  }, [user, loading]); // Re-run the effect when the user or loading state changes

  if (loading) {
    return <div><h3>Loading...</h3></div>; // Display a loading message while fetching the data
  }

  function profile () {
    navigate("/profile")
  };

  // function lobby () {
  //  navigate("/lobby")
 // }

  // JSX structure for dashboard
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
        <button className="profile__btn" onClick={profile}>
          Continue to Profile
        </button>
      </div>
    </div>
  );
}
//<button className="lobby__btn" onClick={lobby}>
//Continue to Lobby
//</button>
export default Dashboard;
