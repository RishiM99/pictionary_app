import React, { useState, useEffect, useRef } from 'react';
import './styles/Room.css';
import getSocket from '../helpers/socket.ts';
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

    const socket = getSocket();
    socket.emit('joinRoom', params.roomId);

    console.log(params);

    return params.roomId;
}

export default function Room() {
    const roomId = useLoaderData() as string;
    const [copyUrlClicked, setCopyUrlClicked] = useState(false);
    const [currentPlayersSidebarWidth, setCurrentPlayersSidebarWidth] = useState<number>(null);
    const [roomNameHeaderHeight, setRoomNameHeaderHeight] = useState<number>(null);


    const currentPlayersSidebarRef = useRef<HTMLDivElement>(null);
    const roomNameHeaderRef = useRef<HTMLDivElement>(null);


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


    useEffect(() => {
        setRoomNameHeaderHeight(roomNameHeaderRef.current.getBoundingClientRect().height);
        setCurrentPlayersSidebarWidth(currentPlayersSidebarRef.current.getBoundingClientRect().width);
    }, [roomNameHeaderRef, currentPlayersSidebarRef]);



    return (
        <div className="container">
            <div className="room-name" ref={roomNameHeaderRef}>
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
                <CurrentPlayersList ref={currentPlayersSidebarRef} />
                <Canvas roomNameHeaderHeight={roomNameHeaderHeight} currentPlayersSidebarWidth={currentPlayersSidebarWidth} roomId={roomId} />
                <Chat />
            </div>
        </div>
    );
};