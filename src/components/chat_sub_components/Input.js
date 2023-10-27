import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase";
import "./Input.css";

const Input = ()=> {

    //Declare State variables:
    const [user, loading] = useAuthState(auth);
    const [state, setState] = useState("state");

    //On-Mount functionality:
    useEffect(() => {
         // code to be executed on mount or change in user/loading state
      },[user, loading]);

      return (
        <div>input message here...</div>
      );

}

export default Input;
