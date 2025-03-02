import { Link, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../LoginPage.tsx/LoginPage";
import Layout from "../Layout/Layout";
import { lazy, Suspense } from "react";
import ScriptsPage from "../ScriptsPage/ScriptsPage";

function Router() {

  const Dashboard = lazy(() => import("../DashboardPage/DashboardPage"));
  const EditDashboard = lazy(() => import("../DashboardPage/EditDashboardPage"));
  const FloorPlan = lazy(() => import("../FloorPlanPage/FloorPlanPage"));
  const Kaleidoscope = lazy(() => import("../KaleidoscopePage/KaleidoscopePage"));
  const Heating = lazy(() => import("../HeatingPage/HeatingPage"));
  const Settings = lazy(() => import("../SettingsPage/SettingsPage"));

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute element={
            <Suspense >
              <Dashboard />
            </Suspense>} />
        } />
        <Route path="edit-dashboard" element={
          <ProtectedRoute element={
            <Suspense >
              <EditDashboard />
            </Suspense>
          } />
        } />
        <Route path="floorplan" element={
          <ProtectedRoute element={
            <Suspense >
              <FloorPlan />
            </Suspense>
          } />
        } />
        <Route path="kaleidoscope" element={
          <ProtectedRoute element={
            <Suspense >
              <Kaleidoscope />
            </Suspense>
          } />
        } />
        <Route path="heating" element={
          <ProtectedRoute element={
            <Suspense>
              <Heating />
            </Suspense>
          } />
        } />
        <Route path="scripts" element={
          <ProtectedRoute element={
            <Suspense>
              <ScriptsPage />
            </Suspense>
          } />
        } />
        <Route path="settings" element={
          <ProtectedRoute element={
            <Suspense>
              <Settings />
            </Suspense>
          } />
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