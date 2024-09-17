import React, { useState, useEffect } from 'react';
import './styles/Room.css';
import Canvas from '../components/Canvas';
import CurrentPlayersList from '../components/CurrentPlayersList';
import Chat from "../components/Chat";
import { useLoaderData, redirect } from 'react-router-dom';

export async function loader({ params }) {
    const response = await fetch("/getUserName");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const { userName } = await response.json();
    console.log(userName);
    if (userName == null) {
        return redirect('/');
    }

    console.log(params);

    return params.roomId;
}

export default function Room() {
    const roomId = useLoaderData();
    const [copyUrlClicked, setCopyUrlClicked] = useState(false);

    useEffect(() => {
        function handleCopyUrlClicked() {
            let intervalId = null;
            if (copyUrlClicked) {
                intervalId = setInterval(() => setCopyUrlClicked(false), 5000);
            }

            return () => {
                if (intervalId != null) {
                    clearInterval(intervalId)
                }
            };
        }

        const handleCopyUrlClickedCleanup = handleCopyUrlClicked();

        return () => {
            handleCopyUrlClickedCleanup();
        }
    }, [copyUrlClicked]);


    return (
        <div className="container">
            <div className="room-name">
                <p className="room-name-text"> {roomId} </p>
                {copyUrlClicked ?
                    <p className="copy-url-copied-confirmation-text"> ✔ Room link has been copied </p> :
                    <div className="copy-url-show-tooltip">
                        <img src={require("../assets/copy.png")} alt="Copy link" className="copy-url-image" onClick={() => {
                            setCopyUrlClicked(true);
                            navigator.clipboard.writeText(window.location.href);
                        }} />
                        <span> Copy room URL </span>
                    </div>
                }
            </div>
            <div className="game-play-area">
                <CurrentPlayersList />
                <Canvas />
                <Chat />
            </div>
        </div>
    );
};