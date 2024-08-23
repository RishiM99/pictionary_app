import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EnterName from "./routes/EnterName.js";
import RouteErrorPage from "./routes/RouteErrorPage.js";
import {useState} from "react";
import NameContext from "./contexts/NameContext.js";

export default function ReactRouterBase() {
  const [name, setName] = useState('');
  const router = createBrowserRouter([
    {
      path: "/",
      element: <EnterName />,
      errorElement: <RouteErrorPage />,
    },
  ]);
  return (
    <NameContext.Provider value = {{name, setName}}>
       <RouterProvider router={router} />;
    </NameContext.Provider>);
}
