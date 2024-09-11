import React from 'react';
import './styles/CurrentPlayersList.css';

const currentPlayerList = ["Emily Johnson", "Jane Smith", "John Doe"];


export default function CurrentPlayersList() {
    return (
        <div className="current-players-list">
            {currentPlayerList.map((player, index) => (
                <div className="current-player" key={index}>
                    <p>
                        {player}
                    </p>
                </div>
            ))}
        </div>
    );
}