import React from 'react';
import {useContext} from 'react';
import "./styles/EnterName.css";
import UserNameContext from '../contexts/UserNameContext.js'
import { Form, redirect } from "react-router-dom";

export async function EnterNameAction({request}) {
    console.log('here');
    const formData = await request.formData();
    console.log(formData.get("userName"));
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
     },
      body: JSON.stringify(
        {userName: formData.get("userName")}
      )
    }
    fetch('/createUser', options)
      .catch(error => console.error(error));

    return redirect(`/rooms`);
}

export default function EnterName () {
    const {userName, setUserName} = useContext(UserNameContext);

    // Handler for input change
    const handleOnChange = (event) => {
        setUserName(event.target.value);
    };

    return (
        <div className="MainPage">
            <p className="question"> What's your name? </p>
            <Form className="name-input-container" method="post">
                <input
                className = "name-input-container-text"
                name="userName"
                type="text"
                placeholder="Enter your name"
                onChange={handleOnChange}
                required
                />
                <button type="submit" className = "name-input-container-submit">Submit</button>
            </Form>
        </div>
    );
};