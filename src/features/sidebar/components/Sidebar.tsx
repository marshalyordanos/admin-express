import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChevronDown, FaCrown } from "react-icons/fa";
import menuItems from "../../../constants/AdminSidebar";
import { useAppSelector } from "../../../store/hooks";

// Types
interface SubSubItem {
  name: string;
  path: string;
}

interface SubItem {
  name: string;
  path: string;
  subsubItems?: SubSubItem[];
}

interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
}

export default function Sidebar() {
  const location = useLocation();
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);

  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  useEffect(() => {
    if (isCollapsed) {
      setExpandedParent(null);
      setExpandedSub(null);
    }
  }, [isCollapsed]);

  const toggleParent = (name: string) => {
    setExpandedParent((prev) => (prev === name ? null : name));
    setExpandedSub(null);
  };

  const toggleSub = (parent: string, sub: string) => {
    const key = `${parent}-${sub}`;
    setExpandedSub((prev) => (prev === key ? null : key));
  };

  const isMenuItemActive = (itemPath: string, subItems?: SubItem[]) => {
    if (location.pathname === itemPath) return true;
    return subItems?.some(
      (s) =>
        location.pathname === s.path ||
        s.subsubItems?.some((ss) => location.pathname === ss.path)
    );
  };

  return (
    <aside
      className={`bg-white text-black h-screen fixed left-0 top-0 font-text overflow-y-auto border-r border-gray transition-all duration-300 ${
        isCollapsed ? "w-22" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-15 pt-6 py-5 bg-white">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-3 px-6"
          }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-darkblue rounded-lg flex items-center justify-center shadow-lg">
            <FaCrown className="text-white text-lg" />
          </div>
          {!isCollapsed && <p className="font-medium">Express Service</p>}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex flex-col gap-2 ${isCollapsed ? "p-2" : "p-4"}`}>
        {menuItems.map((item: MenuItem) => {
          const { name, path, icon, subItems } = item;
          const isActive = isMenuItemActive(path, subItems);
          const isExpanded = expandedParent === name;

          return (
            <div key={name}>
              {/* Parent */}
              <div
                className={`flex items-center justify-between cursor-pointer rounded-lg transition-all ${
                  isActive ? "bg-blue-200" : "hover:bg-blue-200"
                } ${isCollapsed ? "justify-center py-4" : "p-3"}`}
                onClick={() => (subItems ? toggleParent(name) : null)}
              >
                <NavLink
                  to={path}
                  onClick={(e) => subItems && e.preventDefault()}
                  className={`flex items-center gap-3 flex-1 ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <span
                    className={`text-2xl ${
                      isActive ? "text-darkblue" : "text-black"
                    }`}
                  >
                    {icon}
                  </span>
                  {!isCollapsed && (
                    <span
                      className={`${
                        isActive ? "text-darkblue" : "text-black"
                      } text-sm`}
                    >
                      {name}
                    </span>
                  )}
                </NavLink>
                {!isCollapsed && subItems && (
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* Sub Items */}
              {subItems && !isCollapsed && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? "max-h-105 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-6 mt-2 flex flex-col gap-1">
                    {subItems.map((sub) => {
                      const hasSubsub = Array.isArray(sub.subsubItems) && sub.subsubItems.length > 0;
                      const subKey = `${name}-${sub.name}`;
                      const isSubExpanded = expandedSub === subKey;
                      const isSubActive =
                        location.pathname === sub.path ||
                        sub.subsubItems?.some(
                          (ss) => location.pathname === ss.path
                        );

                      return (
                        <div key={sub.name}>
                          <div
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                              isSubActive ? "bg-blue-200" : "hover:bg-blue-200"
                            }`}
                            onClick={() =>
                              hasSubsub && toggleSub(name, sub.name)
                            }
                          >
                            <NavLink
                              to={sub.path}
                              onClick={(e) => hasSubsub && e.preventDefault()}
                              className="flex-1 text-sm"
                            >
                              <span
                                className={
                                  isSubActive ? "text-darkblue" : "text-black"
                                }
                              >
                                {sub.name}
                              </span>
                            </NavLink>
                            {hasSubsub && (
                              <FaChevronDown
                                className={`text-xs transition-transform ${
                                  isSubExpanded ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>

                          {/* Subsub Items */}
                          {hasSubsub && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                isSubExpanded
                                  ? "max-h-96 opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="ml-4 mt-2 flex flex-col gap-1">
                                {sub.subsubItems!.map((ss) => {
                                  const isSSActive =
                                    location.pathname === ss.path;
                                  return (
                                    <NavLink
                                      key={ss.name}
                                      to={ss.path}
                                      className={`p-2 text-sm rounded-lg ${
                                        isSSActive
                                          ? "bg-blue-200 text-darkblue"
                                          : "hover:bg-blue-200"
                                      }`}
                                    >
                                      {ss.name}
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
