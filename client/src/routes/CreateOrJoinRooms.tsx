import './styles/CreateOrJoinRooms.css';
import getSocket from '../helpers/socket.js';
import { useEffect, useState } from "react";
import { redirect, useLoaderData, Form } from "react-router-dom";
import { ListOfRoomsAndMembers, NameOfNewRoom, CreateRoom, JoinRoom } from './../common/SocketEventClasses.ts';

const socket = getSocket();

type loaderData = {
  userName: string;
  initialListOfRoomsAndMembers: ListOfRoomsAndMembers;
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
  socket.emit('get-list-of-rooms-and-members');
  const waitForRoomsAndMembers = function () {
    return new Promise<ListOfRoomsAndMembers>((resolve) => {
      socket.on(ListOfRoomsAndMembers.EVENT_NAME, (listOfRoomsAndMembers) => resolve(ListOfRoomsAndMembers.createFromJSON(listOfRoomsAndMembers)));
    });
  }

  const initialListOfRoomsAndMembers = await waitForRoomsAndMembers();
  return { userName, initialListOfRoomsAndMembers };
}

export async function action({ request }) {
  const formData = Object.fromEntries(await request.formData());
  switch (formData.formType) {
    case "create-new-room-form":
      console.log(new CreateRoom(formData.roomName).convertToJSON());
      socket.emit(CreateRoom.EVENT_NAME, new CreateRoom(formData.roomName).convertToJSON);
      const waitForNameOfNewRoom = function () {
        return new Promise<NameOfNewRoom>((resolve) => {
          socket.on(NameOfNewRoom.EVENT_NAME, (newRoomName) => resolve(NameOfNewRoom.createFromJSON(newRoomName)));
        })
      };
      const nameOfNewRoom = await waitForNameOfNewRoom();
      return redirect(`/room/${nameOfNewRoom.roomId}`);
    case "join-room-form":
      socket.emit(JoinRoom.EVENT_NAME, new JoinRoom(formData.roomName).convertToJSON());
      return redirect(`/room/${formData.roomName}`);
    default:
      return null;
  }
}

export default function CreateOrJoinRooms() {
  const { userName, initialListOfRoomsAndMembers } = useLoaderData() as loaderData;
  const [listOfRoomsAndMembers, setListOfRoomsAndMembers] = useState(initialListOfRoomsAndMembers.listOfRoomsAndMembers);

  useEffect(() => {
    function onGetListOfRoomsAndMembers(value) {
      console.log("list of rooms and members:");
      console.log(value);
      setListOfRoomsAndMembers(ListOfRoomsAndMembers.createFromJSON(value).listOfRoomsAndMembers);
    }

    socket.on(ListOfRoomsAndMembers.EVENT_NAME, onGetListOfRoomsAndMembers);

    return () => {
      socket.off('list-of-rooms-and-members', onGetListOfRoomsAndMembers);
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