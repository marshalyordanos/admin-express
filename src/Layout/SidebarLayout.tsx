import { useAppSelector } from "../store/hooks";
import Header from "../components/Header";
import Sidebar from "../features/sidebar/components/Sidebar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);

  return (
    <div className="flex">
      <Sidebar />
      <div
        className={`min-h-screen w-full bg-white duration-300 ${
          isCollapsed ? "ml-22" : "ml-80"
        }`}
      >
        <Header />
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
