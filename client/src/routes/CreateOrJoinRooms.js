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

  return (
    <div className="container">
       <p> Hi, {userName}! 👋</p>
       <div className="create-or-join-rooms">
        <div className="create-room">
          <p> Create a new room </p>
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
          <p>Existing Rooms</p>
          <ul>
            {listOfRooms ?? [].map((room, index) => (
              <li key={index} className="room-item">
                {room}
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
  );
};