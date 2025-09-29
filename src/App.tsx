import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./Layout/SidebarLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CreateBranch from "./pages/Branch/CreateBranchPage";
import AllBranch from "./pages/Branch/AllBranchPage";
import UpdateBranch from "./pages/Branch/UpdateBranchPage";
import AssignBranch from "./pages/Branch/AssignManagerPage";
import RevokeManager from "./pages/Branch/RevokeManagerPage";
import AllStaffPage from "./pages/Staff/AllStaffPage";
import CreateStaffPage from "./pages/Staff/CreateStaffPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderForm from "./features/orders/components/OrdersForm";
import OrderDetails from "./features/orders/components/OrderDetails";
import DispatchPage from "./pages/DispatchPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LoginPage />} />
          <Route element={<SidebarLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/branch/create" element={<CreateBranch />} />
            <Route path="/branch/update/:id" element={<UpdateBranch />} />
            <Route path="/branch/all" element={<AllBranch />} />
            <Route path="/branch/assign-manager" element={<AssignBranch />} />
            <Route path="/branch/revoke-manager" element={<RevokeManager />} />
            <Route path="/staff/all" element={<AllStaffPage />} />
            <Route path="/staff/create" element={<CreateStaffPage />} />
            <Route path="/order" element={<OrdersPage />} />
            <Route path="/order/new" element={<OrderForm />} />
            <Route path="/order/details/:id" element={<OrderDetails />} />
            <Route path="/dispatch" element={<DispatchPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
