import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import Run from "./sites/Run/Run.tsx";

const router = createHashRouter([{ path: "/run", element: <Run /> }]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
