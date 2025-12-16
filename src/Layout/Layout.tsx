import { useAppSelector } from "../store/hooks";
import Header from "../components/Header";
import Sidebar from "../features/sidebar/components/Sidebar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);

  return (
    <div className="flex overflow-x-hidden max-w-full">
      <Sidebar />
      <div
        className={`min-h-screen w-full bg-white transition-all duration-300 overflow-x-hidden max-w-full ${
          isCollapsed ? "ml-0 lg:ml-20" : "ml-0 lg:ml-80"
        }`}
      >
        <Header />
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 overflow-x-hidden max-w-full pt-16 sm:pt-20 lg:pt-24">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
