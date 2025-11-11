import { createBrowserRouter } from "react-router-dom";

import Home from "client/home/views/Index";
import Login from "auth/Login";
import Register from "auth/Register";
import ClientLayout from "client/common/Layout";
import Search from "search/search";

const router = createBrowserRouter([
  {
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      ,
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
]);

export default router;
