import React, { useState } from 'react';
import './styles/Room.css';

export default function Room() {
    const [messages, setMessages] = useState([
        { user: 'John Doe', text: 'Hello, everyone!' },
        { user: 'Jane Smith', text: 'Hi John! How\'s it going?' },
        { user: 'Emily Johnson', text: 'Hey! Ready for the meeting?' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, { user: 'You', text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div className="container">
            <div className="chat-name">
                <p className="chat-name-text"> Example Chat Name </p>
                <div className="copy-url">
                    <img src={require("../assets/copy.png")} alt="Copy link"/>
                    <span>Copy room URL</span>
                </div>
            </div>
            <main className="chat-area">
                <div className="messages">
                    {messages.map((message, index) => (
                        <div className="message" key={index}>
                            <span className="username">{message.user}:</span> {message.text}
                        </div>
                    ))}
                </div>
                <form className="message-input" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        placeholder="Type a message..." 
                        required 
                    />
                    <button type="submit">Send</button>
                </form>
            </main>
        </div>
    );
};