import { Link, Route, Routes } from "react-router-dom";
import DashboardPage from "../DashboardPage/DashboardPage";
import SettingsPage from "../SettingsPage/SettingsPage";
import HeatingPage from "../HeatingPage/HeatingPage";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../LoginPage.tsx/LoginPage";
import KaleidoscopePage from "../KaleidoscopePage/KaleidoscopePage";
import Layout from "../Layout/Layout";

function Router() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute element={<DashboardPage />} />
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
        <Route path="*" element={
          <ProtectedRoute element={<NoMatch />} />
        } />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
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