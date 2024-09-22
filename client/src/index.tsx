import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './helpers/reportWebVitals.js';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EnterName, { action as enterNameAction, loader as enterNameLoader } from "./routes/EnterName.tsx";
import RouteErrorPage from "./routes/RouteErrorPage.js";
import CreateOrJoinRooms, { loader as createOrJoinRoomsLoader, action as createOrJoinRoomsAction } from "./routes/CreateOrJoinRooms.tsx";
import Room, { loader as roomLoader } from './routes/Room.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <EnterName />,
    errorElement: <RouteErrorPage />,
    action: enterNameAction,
    loader: enterNameLoader,
  },
  {
    path: "/rooms",
    element: <CreateOrJoinRooms />,
    loader: createOrJoinRoomsLoader,
    action: createOrJoinRoomsAction,
  },
  {
    path: "/room/:roomId",
    element: <Room />,
    loader: roomLoader,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
