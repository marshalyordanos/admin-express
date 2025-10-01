import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./Layout/SidebarLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BranchPage from "./pages/Branch/BranchPage";
import CreateBranch from "./pages/Branch/CreateBranchPage";
import AssignBranch from "./pages/Branch/AssignManagerPage";
import RevokeManager from "./pages/Branch/RevokeManagerPage";
import StaffPage from "./pages/Staff/StaffPage";
import AllStaffPage from "./pages/Staff/AllStaffPage";
import CreateStaffPage from "./pages/Staff/CreateStaffPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderForm from "./features/orders/components/OrdersForm";
import OrderDetails from "./features/orders/components/OrderDetails";
import DispatchPage from "./pages/DispatchPage";
import FleetPage from "./pages/Fleet/FleetPage";
import CreateVehiclePage from "./pages/Fleet/CreateVehiclePage";
import EditVehiclePage from "./pages/Fleet/EditVehiclePage";
import MaintenanceLogPage from "./pages/Fleet/MaintenanceLogPage";
import EditStaffPage from "./pages/Staff/EditStaffPage";
import EditBranchPage from "./pages/Branch/EditBranchPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LoginPage />} />
          <Route element={<SidebarLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/branch" element={<BranchPage />} />
            <Route path="/branch/create" element={<CreateBranch />} />
            <Route path="/branch/edit/:id" element={<EditBranchPage />} />
            <Route path="/branch/assign-manager" element={<AssignBranch />} />
            <Route path="/branch/revoke-manager" element={<RevokeManager />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/staff/all" element={<AllStaffPage />} />
            <Route path="/staff/create" element={<CreateStaffPage />} />
            <Route path="/staff/edit/:id" element={<EditStaffPage />} />
            <Route path="/order" element={<OrdersPage />} />
            <Route path="/order/new" element={<OrderForm />} />
            <Route path="/order/details/:id" element={<OrderDetails />} />
            <Route path="/dispatch" element={<DispatchPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/fleet/create" element={<CreateVehiclePage />} />
            <Route path="/fleet/edit/:id" element={<EditVehiclePage />} />
            <Route path="/fleet/maintenance" element={<MaintenanceLogPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
