import './styles/CreateOrJoinRooms.css'; // Import your CSS file for styling
import socket from '../socket.js';
import {useEffect, useState} from "react";
import { redirect, useLoaderData, Form } from "react-router-dom";

export async function loader() {
  const response = await fetch("/getUserName");
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const {userName} = await response.json();
  console.log(userName);
  if (userName == null) {
    return redirect('/');
  }
  return userName;
}

export async function action({request}) {
  const formData = Object.fromEntries(await request.formData());
  switch (formData.formType) {
    case "create-new-room-form":
      socket.emit('create-room', {roomName: formData.roomName});
      return null;
    case "join-room-form":
      return null;
    default:
      return null;
  }
}

export default function CreateOrJoinRooms() {
  const userName = useLoaderData();
  const [listOfRoomsAndMembers, setListOfRoomsAndMembers] = useState();

  useEffect(() => {
    function onGetListOfRoomsAndMembers(value) {
      console.log(value);
      setListOfRoomsAndMembers(value);
    }

    socket.on('list-of-rooms-and-members', onGetListOfRoomsAndMembers);

    return () => {
      socket.off('list-of-rooms-and-members', onGetListOfRoomsAndMembers);
    };
  })

  return (
    <div className="container">
      <div className="flexbox-container">
        <p className="create-or-join-room-header"> Hi, {userName}! 👋</p>
        <div className="create-or-join-rooms">
          <div className="create-room">
            <p className="create-room-header"> Create a new room </p>
            <Form method="post">
              <input name="formType" hidden defaultValue="create-new-room-form" />
              <input
                name="roomName"
                type="text"
                placeholder="Enter room name"
                required
              />
              <button>Create Room</button>
            </Form>
          </div>
          <div className="room-list">
            <p className="room-list-header">Existing Rooms</p>
            <ul>
              {(listOfRoomsAndMembers ?? []).map((roomAndMembers, index) => (
                <li key={index} className="room-item">
                  <div className="room-name-and-members">
                    <p className="room-name">
                      {roomAndMembers.roomId}
                    </p>
                    {roomAndMembers.displayTextForMembers !== "" && <p className="room-members"> Members: {roomAndMembers.displayTextForMembers}</p>}
                  </div>
                  <Form method="post">
                    <input name="formType" hidden defaultValue="join-room-form" />
                    <button>Join</button>
                  </Form>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    
  );
};