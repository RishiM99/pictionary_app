import React from 'react';
import {useContext} from 'react';
import "./styles/EnterName.css";
import UserNameContext from '../contexts/UserNameContext.js'
import { Form } from "react-router-dom";


export default function EnterName () {
    const {userName, setUserName} = useContext(UserNameContext);

    // Handler for input change
    const handleOnSubmit = (event) => {
        setUserName(event.target.value);
    };

    return (
        <div className="MainPage">
            <p className="question"> What's your name? </p>
            <Form className="name-input-container" action="/rooms">
                <input
                className = "name-input-container-text"
                type="text"
                placeholder="Enter your name"
                required
                name="username"
                />
                <input type="submit" value="Submit" className = "name-input-container-submit" onSubmit={handleOnSubmit}/>
            </Form>
        </div>
    );
};