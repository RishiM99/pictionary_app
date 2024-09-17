import './styles/CreateOrJoinRooms.css'; // Import your CSS file for styling
import getSocket from '../helpers/socket.js';
import { useEffect, useState } from "react";
import { redirect, useLoaderData, Form } from "react-router-dom";

const socket = getSocket();

export async function loader() {
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
  socket.emit('get-list-of-rooms-and-members');
  const waitForRoomsAndMembers = function () {
    return new Promise((resolve) => {
      socket.on('list-of-rooms-and-members', (listOfRoomsAndMembers) => resolve(listOfRoomsAndMembers));
    });
  }

  const initialListOfRoomsAndMembers = await waitForRoomsAndMembers();
  return { userName, initialListOfRoomsAndMembers };
}

export async function action({ request }) {
  const formData = Object.fromEntries(await request.formData());
  switch (formData.formType) {
    case "create-new-room-form":
      socket.emit('create-room', { roomName: formData.roomName });
      const waitForNameOfNewRoom = function () {
        return new Promise((resolve) => {
          socket.on('name-of-new-room', (newRoomName) => resolve(newRoomName));
        })
      };
      const nameOfNewRoom = await waitForNameOfNewRoom();
      return redirect(`/room/${nameOfNewRoom.roomId}`);
    case "join-room-form":
      socket.emit('join-room', { roomName: formData.roomName });
      return redirect(`/room/${formData.roomName}`);
    default:
      return null;
  }
}

export default function CreateOrJoinRooms() {
  const { userName, initialListOfRoomsAndMembers } = useLoaderData();
  const [listOfRoomsAndMembers, setListOfRoomsAndMembers] = useState(initialListOfRoomsAndMembers);

  useEffect(() => {
    function onGetListOfRoomsAndMembers(value) {
      console.log("list of rooms and members:");
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
                  <input name="roomName" hidden defaultValue={roomAndMembers.roomId} />
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