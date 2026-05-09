import { createBrowserRouter } from "react-router-dom";
import { Home } from "./components/home";
import { NarrowingRedesign } from "./components/narrowing-redesign";
import { ResultClean } from "./components/result-clean";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/narrowing",
    Component: NarrowingRedesign,
  },
  {
    path: "/result",
    Component: ResultClean,
  },
]);