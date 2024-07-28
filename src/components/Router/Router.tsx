import { Link, Outlet, Route, Routes } from "react-router-dom";
import Menubar from "../Menubar/Menubar";
import { Box } from "@chakra-ui/react";
import DashboardPage from "../DashboardPage/DashboardPage";
import SettingsPage from "../SettingsPage/SettingsPage";
import HeatingPage from "../HeatingPage/HeatingPage";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../LoginPage.tsx/LoginPage";
import KaleidoscopePage from "../KaleidoscopePage/KaleidoscopePage";

function Router() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute element={<KaleidoscopePage />} />
        } />
        <Route path="kaleidoscope" element={
          <ProtectedRoute element={<KaleidoscopePage />} />
        } />
        <Route path="heating" element={
          <ProtectedRoute element={<HeatingPage />} />
        } />
        <Route path="settings" element={
          <ProtectedRoute element={<SettingsPage />} />
        } />
        <Route path="*" element={<NoMatch />} />
      </Route>
      <Route path="/login" element={<LoginPage />} /> {/* Add Login Route */}
    </Routes>
  )
}


function Layout() {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Menubar />

      {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
      <Outlet />
    </Box>

  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default Router;