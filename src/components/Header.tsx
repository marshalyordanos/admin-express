import { FaBell, FaBars } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { toggleSidebar } from "../features/sidebar/sidebarSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <header
      className={`bg-white font-text border-b border-gray px-3 sm:px-4 lg:px-6 flex justify-between items-center sticky top-0 z-15 ${
        isCollapsed ? "py-3 sm:py-4" : "py-3 sm:py-4 lg:py-5"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaBars className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <h2 className="font-semibold text-black text-sm sm:text-base lg:text-lg">
          <span className="hidden md:inline">Courier Management System</span>
          <span className="md:hidden">CMS</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <button className="p-1.5 sm:p-2 rounded-lg text-black relative hover:bg-gray-100 transition-colors">
          <FaBell className="text-sm sm:text-base" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red rounded-full"></span>
        </button>

        <div className="h-5 sm:h-6 w-px bg-gray-300"></div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-black">Abebe</p>
            <p className="text-xs text-gray-600">Administrator</p>
          </div>
          <div className="relative group pr-1 sm:pr-2">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=0B1120&color=fff"
              alt="Admin Avatar"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray hover:border-blue-500 transition-colors cursor-pointer"
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-200 text-black">
                <p className="text-sm font-medium text-black">Admin</p>
                <p className="text-xs text-gray-400">admin@horizontech.com</p>
              </div>
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                  Profile Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                  Account Settings
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
