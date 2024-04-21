import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Index from "./pages/Index";
import MyPage from "./pages/MyPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index Component={Index} />\
      <Route path="/me" Component={MyPage} />
    </>
  )
);
