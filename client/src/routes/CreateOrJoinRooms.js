import './styles/CreateOrJoinRooms.css'; // Import your CSS file for styling
import socket from '../socket.js';
import UserNameContext from "../contexts/UserNameContext.js";
import {useContext, useEffect, useState} from "react";


export default function CreateOrJoinRooms() {
  const [listOfRooms, setListOfRooms] = useState();

  useEffect(() => {
    function onGetListOfRooms(value) {
      console.log(value);
      setListOfRooms(value);
    }

    socket.on('list-of-rooms', onGetListOfRooms);

    return () => {
      socket.off('list-of-rooms', onGetListOfRooms);
    };
  })
  const {userName, setUserName} = useContext(UserNameContext);

  const handleCreateRoom = (event) => {
    socket.emit('create-room', {userName: userName, roomName: event.target.value});
  };

  const handleJoinRoom = (roomName) => {
    // Replace with actual join logic
  };


  return (
    <div className="create-or-join-rooms">
        <div className="create-room">
          <p> Create a new room </p>
          <input
            type="text"
            placeholder="Enter room name"
            required
          />
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>
        <div className="room-list">
          <p>Existing Rooms</p>
          <ul>
            {listOfRooms ?? [].map((room, index) => (
              <li key={index} className="room-item">
                {room}
                <button onClick={() => handleJoinRoom(room)}>Join</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
);
};