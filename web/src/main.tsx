import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import Run from "./sites/Run/Run.tsx";
import Home from "./sites/Home/Home.tsx";
import Error from "./sites/Error/Error.tsx";
import Wrapper from "./sites/Docs/Wrapper/Wrapper.tsx";
import Intro from "./sites/Docs/Intro.mdx";

const router = createHashRouter([
    { path: "/run", element: <Run /> },
    { path: "/docs/intro", element: <Wrapper doc={<Intro />} /> },
    { path: "/", element: <Home />, errorElement: <Error /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
