import React, { useState, useEffect} from 'react';
import './styles/Room.css';
import Canvas from '../components/Canvas';
import CurrentPlayersList from '../components/CurrentPlayersList';
import Chat from "../components/Chat";

export default function Room() {
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
            <div className="chat-name">
                <p className="chat-name-text"> Example Chat Name </p>
                {copyUrlClicked ? 
                    <p className="copy-url-copied-confirmation-text"> ✔ Room link has been copied </p> : 
                    <div className="copy-url-show-tooltip">
                        <img src={require("../assets/copy.png")} alt="Copy link" className="copy-url-image" onClick={() => {
                            setCopyUrlClicked(true);
                            navigator.clipboard.writeText(window.location.href);
                        }}/>
                        <span> Copy room URL </span>
                    </div>
                }
            </div>
            <div className="game-play-area">
                <CurrentPlayersList/>
                <Canvas/>
                <Chat/>
            </div>
        </div>
    );
};