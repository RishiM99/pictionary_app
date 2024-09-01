import './styles/CreateOrJoinRooms.css'; // Import your CSS file for styling
import socket from '../socket.js';
import UserNameContext from "../contexts/UserNameContext.js";
import {useContext, useEffect, useState} from "react";
import { Navigate } from "react-router-dom";



export default function CreateOrJoinRooms() {
  const [listOfRooms, setListOfRooms] = useState();
  const [newRoomName, setNewRoomName] = useState('');

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

  if (userName === '') {
    console.log('here');
    //return <Navigate to={{ pathname: '/' }}/>
  }

  const handleUpdatedRoomName = (event) => {
    setNewRoomName(event.target.value);
  }

  const handleCreateRoom = () => {
    socket.emit('create-room', {userName: userName, roomName: newRoomName});
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
            onChange={handleUpdatedRoomName}
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