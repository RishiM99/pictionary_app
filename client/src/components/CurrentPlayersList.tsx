import React, { forwardRef } from 'react';
import './styles/CurrentPlayersList.css';

const currentPlayerList = ["Emily Johnson", "Jane Smith", "John Doe"];


const CurrentPlayersList = forwardRef(function CurrentPlayersList(props, currentPlayersListRef: React.MutableRefObject<HTMLDivElement>) {
    return (
        <div className="current-players-list" ref={currentPlayersListRef}>
            {currentPlayerList.map((player, index) => (
                <div className="current-player" key={index}>
                    <p>
                        {player}
                    </p>
                </div>
            ))}
        </div>
    );
});

export default CurrentPlayersList;