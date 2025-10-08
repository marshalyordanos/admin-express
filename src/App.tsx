import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./Layout/Layout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BranchPage from "./pages/Branch/BranchPage";
import CreateBranch from "./pages/Branch/CreateBranchPage";
import AssignBranch from "./pages/Branch/AssignManagerPage";
import RevokeManager from "./pages/Branch/RevokeManagerPage";
import StaffPage from "./pages/Staff/StaffPage";
import CreateStaffPage from "./pages/Staff/CreateStaffPage";
import OrdersPage from "./pages/orders/OrdersPage";
import CreateOrder from "./features/orders/components/CreateOrder";
import OrderDetails from "./features/orders/components/OrderDetails";
import DispatchPage from "./pages/DispatchPage";
import FleetPage from "./pages/Fleet/FleetPage";
import CreateVehiclePage from "./pages/Fleet/CreateVehiclePage";
import EditVehiclePage from "./pages/Fleet/EditVehiclePage";
import MaintenanceLogPage from "./pages/Fleet/MaintenanceLogPage";
import EditStaffPage from "./pages/Staff/EditStaffPage";
import EditBranchPage from "./pages/Branch/EditBranchPage";
import CreateMaintenanceLogPage from "./pages/Fleet/CreateMaintenanceLogPage";
import EditMaintenanceLogPage from "./pages/Fleet/EditMaintenanceLogPage";
import VehicleDetailsPage from "./pages/Fleet/VehicleDetailsPage";
import StaffDetailsPage from "./pages/Staff/StaffDetailsPage";
import BranchDetailsPage from "./pages/Branch/BranchDetailsPage";
import CustomerDetailsPage from "./pages/Customer/CustomerDetailsPage";
import CustomerPage from "./pages/Customer/CustomerPage";
import CreateCustomerPage from "./pages/Customer/CreateCustomerPage";
import EditCustomerPage from "./pages/Customer/EditCustomerPage";
import CorporateClientsPage from "./pages/Customer/CorporateClientsPage";
import LoyaltyProgramPage from "./pages/Customer/LoyaltyProgramPage";
import ComplaintsPage from "./pages/Customer/ComplaintsPage";
import AddPointsPage from "./pages/Customer/AddPointsPage";
import CreateComplaintPage from "./pages/Customer/CreateComplaintPage";
import PricingPage from "./pages/PricingPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./components/ProtectedRoutes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<LoginPage />} />
            <Route element={<SidebarLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="/branch" element={<BranchPage />} />
              <Route
                path="/branch/details/:id"
                element={<BranchDetailsPage />}
              />
              <Route path="/branch/create" element={<CreateBranch />} />
              <Route path="/branch/edit/:id" element={<EditBranchPage />} />
              <Route path="/branch/assign-manager" element={<AssignBranch />} />
              <Route
                path="/branch/revoke-manager"
                element={<RevokeManager />}
              />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/staff/details/:id" element={<StaffDetailsPage />} />
              <Route path="/staff/create" element={<CreateStaffPage />} />
              <Route path="/staff/edit/:id" element={<EditStaffPage />} />
              <Route path="/order" element={<OrdersPage />} />
              <Route path="/order/new" element={<CreateOrder />} />
              <Route path="/order/details/:id" element={<OrderDetails />} />
              <Route path="/dispatch" element={<DispatchPage />} />
              <Route path="/fleet" element={<FleetPage />} />
              <Route
                path="/fleet/details/:id"
                element={<VehicleDetailsPage />}
              />
              <Route path="/fleet/create" element={<CreateVehiclePage />} />
              <Route path="/fleet/edit/:id" element={<EditVehiclePage />} />
              <Route
                path="/fleet/maintenance"
                element={<MaintenanceLogPage />}
              />
              <Route
                path="/fleet/maintenance/create"
                element={<CreateMaintenanceLogPage />}
              />
              <Route
                path="/fleet/maintenance/edit/:id"
                element={<EditMaintenanceLogPage />}
              />
              <Route path="/customer" element={<CustomerPage />} />
              <Route
                path="/customer/details/:id"
                element={<CustomerDetailsPage />}
              />
              <Route path="/customer/create" element={<CreateCustomerPage />} />
              <Route path="/customer/edit/:id" element={<EditCustomerPage />} />
              <Route
                path="/customer/corporate"
                element={<CorporateClientsPage />}
              />
              <Route
                path="/customer/loyalty"
                element={<LoyaltyProgramPage />}
              />
              <Route
                path="/customer/loyalty/create"
                element={<AddPointsPage />}
              />
              <Route path="/customer/complaints" element={<ComplaintsPage />} />
              <Route
                path="/customer/complaints/create"
                element={<CreateComplaintPage />}
              />
              <Route path="/pricing" element={<PricingPage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
