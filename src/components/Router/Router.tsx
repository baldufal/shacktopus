import { Link, Outlet, Route, Routes } from "react-router-dom";
import ThermocontrolPage from "../ThermocontrolPage/ThermocontrolPage";
import Menubar from "../Menubar/Menubar";
import { Box } from "@chakra-ui/react";

function Router() {


    return (
        <div>
         {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
        <Route path="thermocontrol" element={<ThermocontrolPage />} />


        {/* Using path="*"" means "match anything", so this route
              acts like a catch-all for URLs that we don't have explicit
              routes for. */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
    </div>
    )
}

function Dashboard() {
    return (
      <div>
        <h2>Dashboard</h2>
      </div>
    );
  }

function Layout() {
    return (
        <Box display="flex" flexDirection="column" height="100vh">
        <Menubar/>
  
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