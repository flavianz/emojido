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
import HelloWorld from "./sites/Docs/HelloWorld.mdx";
import Variables from "./sites/Docs/Variables.mdx";
import Loops from "./sites/Docs/Loops.mdx";
import Conditionals from "./sites/Docs/Conditionals.mdx";
import Comments from "./sites/Docs/Comments.mdx";

const router = createHashRouter([
    { path: "/run", element: <Run /> },
    { path: "/docs", element: <Wrapper doc={<Intro />} /> },
    { path: "/docs/hello-world", element: <Wrapper doc={<HelloWorld />} /> },
    { path: "/docs/loops", element: <Wrapper doc={<Loops />} /> },
    { path: "/docs/conditionals", element: <Wrapper doc={<Conditionals />} /> },
    { path: "/docs/comments", element: <Wrapper doc={<Comments />} /> },
    { path: "/docs/variables", element: <Wrapper doc={<Variables />} /> },
    { path: "/", element: <Home />, errorElement: <Error /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
