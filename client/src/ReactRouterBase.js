import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EnterName, {EnterNameAction} from "./routes/EnterName.js";
import RouteErrorPage from "./routes/RouteErrorPage.js";
import CreateOrJoinRooms from "./routes/CreateOrJoinRooms.js";
import {useState} from "react";
import UserNameContext from "./contexts/UserNameContext.js";

export default function ReactRouterBase() {
  const [userName, setUserName] = useState('');
  const router = createBrowserRouter([
    {
      path: "/",
      element: <EnterName />,
      errorElement: <RouteErrorPage />,
      action: EnterNameAction,
    },
    {
      path: "/rooms",
      element: <CreateOrJoinRooms />,
    },
  ]);
  return (
    <UserNameContext.Provider value = {{userName, setUserName}}>
      <RouterProvider router={router} />
    </ UserNameContext.Provider>

  )
}
