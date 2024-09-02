import React from 'react';
import "./styles/EnterName.css";
import { Form, redirect } from "react-router-dom";

export async function loader() {
  const response = await fetch("/getUserName");
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const {userName} = await response.json();
  console.log(userName);
  if (userName != null) {
    return redirect('/rooms');
  }
  return null;
}

export async function action({request}) {
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
    return (
        <div className="MainPage">
            <p className="question"> What's your name? </p>
            <Form className="name-input-container" method="post">
                <input
                className = "name-input-container-text"
                name="userName"
                type="text"
                placeholder="Enter your name"
                required
                />
                <button type="submit" className = "name-input-container-submit">Submit</button>
            </Form>
        </div>
    );
};