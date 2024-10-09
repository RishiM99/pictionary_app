import './styles/CreateOrJoinRooms.css';
import getSocket from '../helpers/socket.ts';
import { useEffect, useState } from "react";
import { redirect, useLoaderData, Form } from "react-router-dom";
import { RoomAndMembers } from './../common/SocketEvents.ts';

const socket = getSocket();


type loaderData = {
  userName: string;
  initialListOfRoomsAndMembers: RoomAndMembers[];
};

export async function loader(): Promise<loaderData | Response> {
  const response = await fetch("/getUserName");
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  console.log(response);
  const userName = ((await response.json()) as any).userName;
  console.log(`USERNAME: ${userName}`);
  if (userName == null) {
    return redirect('/');
  }

  const socket = getSocket();
  socket.emit('getListOfRoomsAndMembers');
  const waitForRoomsAndMembers = function () {
    return new Promise<RoomAndMembers[]>((resolve) => {
      socket.on('listOfRoomsAndMembers', (listOfRoomsAndMembers) => resolve(listOfRoomsAndMembers));
    });
  }

  const initialListOfRoomsAndMembers = await waitForRoomsAndMembers();
  return { userName, initialListOfRoomsAndMembers };
}

export async function action({ request }) {
  const formData = Object.fromEntries(await request.formData());
  switch (formData.formType) {
    case "create-new-room-form":
      socket.emit('createRoom', formData.roomName);
      const waitForNameOfNewRoom = function () {
        return new Promise<string>((resolve) => {
          socket.on('nameOfNewRoom', (newRoomName) => resolve(newRoomName));
        })
      };
      const nameOfNewRoom = await waitForNameOfNewRoom();
      return redirect(`/room/${nameOfNewRoom}`);
    case "join-room-form":
      socket.emit('joinRoom', formData.roomName);
      return redirect(`/room/${formData.roomName}`);
    default:
      return null;
  }
}

export default function CreateOrJoinRooms() {
  const { userName, initialListOfRoomsAndMembers } = useLoaderData() as loaderData;
  const [listOfRoomsAndMembers, setListOfRoomsAndMembers] = useState(initialListOfRoomsAndMembers);

  useEffect(() => {
    function onGetListOfRoomsAndMembers(listOfRoomsAndMembers) {
      console.log("list of rooms and members:");
      console.log(listOfRoomsAndMembers);
      setListOfRoomsAndMembers(listOfRoomsAndMembers);
    }

    socket.on('listOfRoomsAndMembers', onGetListOfRoomsAndMembers);

    return () => {
      socket.off('listOfRoomsAndMembers', onGetListOfRoomsAndMembers);
    };
  })

  return (
    <div className="container" >
      <p className="create-or-join-room-header" > Hi, {userName}! 👋</p>
      < div className="create-or-join-rooms" >
        <div className="create-room" >
          <p className="create-room-header" > Create a new room </p>
          < Form method="post" >
            <input name="formType" hidden defaultValue="create-new-room-form" />
            <input
              name="roomName"
              type="text"
              placeholder="Enter room name"
              required
            />
            <button>Create Room </button>
          </Form>
        </div>
        < div className="room-list" >
          <p className="room-list-header" > Existing Rooms </p>
          <ul>
            {
              (listOfRoomsAndMembers ?? []).map((roomAndMembers, index) => (
                <li key={index} className="room-item" >
                  <div className="room-name-and-members" >
                    <p className="room-name" >
                      {roomAndMembers.roomId}
                    </p>
                    {roomAndMembers.displayTextForMembers !== "" && <p className="room-members"> Members: {roomAndMembers.displayTextForMembers} </p>}
                  </div>
                  < Form method="post" >
                    <input name="formType" hidden defaultValue="join-room-form" />
                    <input name="roomName" hidden defaultValue={roomAndMembers.roomId} />
                    <button>Join </button>
                  </Form>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};