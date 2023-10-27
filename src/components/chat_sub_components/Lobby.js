import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase";
import "./Lobby.css";

const Lobby = ()=> {

    //Declare State variables:
    const [user, loading] = useAuthState(auth);
    const [state, setState] = useState("state");

    //On-Mount functionality:
    useEffect(() => {
         // code to be executed on mount or change in user/loading state
      },[user, loading]);

      
      return (
        <div></div>
      );

}

export default Lobby;
