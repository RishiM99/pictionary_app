import React from 'react';
import {useContext} from 'react';
import "./styles/EnterName.css";
import NameContext from '../contexts/NameContext.js'

export default function EnterName () {
    const {name, setName} = useContext(NameContext);

    // Handler for input change
    const handleInputChange = (event) => {
    setName(event.target.value);
    };

    return (
        <div className="MainPage">
            <p className="question"> What's your name? </p>
            <div className="name-input-container">
                <input
                type="text"
                value={name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                />
            </div>
        </div>
    );
};