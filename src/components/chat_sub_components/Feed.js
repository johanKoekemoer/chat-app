import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase";
import "./Feed.css";

const Feed = ()=> {

    //Declare State variables:
    const [user, loading] = useAuthState(auth);
    const [state, setState] = useState("state");

    //On-Mount functionality:
    useEffect(() => {
         // code to be executed on mount or change in user/loading state
      },[user, loading]);

      return (
        <div>No Chat selected...</div>
      );

}

export default Feed;
