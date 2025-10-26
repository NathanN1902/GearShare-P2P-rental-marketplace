import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../features/home/pages/Home";
import Browse from "../features/browse/pages/Browse";
import ToolDetails from "../features/tool/pages/ToolDetails";
import Login from "../features/auth/pages/Login";
import User from "../features/user/pages/User";
import List from "../features/list/pages/List";

function RootLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "browse", element: <Browse /> },
      { path: "tools/:id", element: <ToolDetails /> },
      { path: "login", element: <Login /> },
      { path: "user", element: <User /> },
      { path: "list", element: <List /> },
    ],
  },
]);

