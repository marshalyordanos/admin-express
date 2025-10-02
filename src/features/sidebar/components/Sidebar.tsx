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
  icon?: React.ReactNode;
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

  // Auto-expand parent menus when on sub-routes
  useEffect(() => {
    if (isCollapsed) return;

    menuItems.forEach((item: MenuItem) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(
          (sub: SubItem) =>
            location.pathname === sub.path ||
            location.pathname.startsWith(sub.path + "/") ||
            (sub.subsubItems &&
              sub.subsubItems.some(
                (ss: SubSubItem) =>
                  location.pathname === ss.path ||
                  location.pathname.startsWith(ss.path + "/")
              ))
        );

        if (hasActiveSubItem) {
          setExpandedParent(item.name);

          // Also expand sub-items if they have active sub-sub-items
          item.subItems.forEach((sub: SubItem) => {
            if (sub.subsubItems) {
              const hasActiveSubSubItem = sub.subsubItems.some(
                (ss: SubSubItem) =>
                  location.pathname === ss.path ||
                  location.pathname.startsWith(ss.path + "/")
              );

              if (hasActiveSubSubItem) {
                setExpandedSub(`${item.name}-${sub.name}`);
              }
            }
          });
        }
      }
    });
  }, [location.pathname, isCollapsed]);

  const toggleParent = (name: string) => {
    setExpandedParent((prev) => (prev === name ? null : name));
    setExpandedSub(null);
  };

  const toggleSub = (parent: string, sub: string) => {
    const key = `${parent}-${sub}`;
    setExpandedSub((prev) => (prev === key ? null : key));
  };

  const isMenuItemActive = (itemPath: string, subItems?: SubItem[]) => {
    // Check exact match first
    if (location.pathname === itemPath) return true;

    // Check if current path starts with the item path (for management modules)
    if (location.pathname.startsWith(itemPath + "/")) return true;

    // Check sub-items
    return subItems?.some(
      (s) =>
        location.pathname === s.path ||
        location.pathname.startsWith(s.path + "/") ||
        s.subsubItems?.some(
          (ss) =>
            location.pathname === ss.path ||
            location.pathname.startsWith(ss.path + "/")
        )
    );
  };

  return (
    <aside
      className={`bg-white text-black h-screen fixed left-0 top-0 z-50 font-text overflow-y-auto border-r border-gray transition-all duration-300 ${
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
                className={`flex items-center justify-between cursor-pointer rounded-lg transition-all group ${
                  isActive ? "bg-blue-500" : "hover:bg-blue-500"
                } ${isCollapsed ? "justify-center py-4" : ""}`}
                onClick={() => (subItems ? toggleParent(name) : null)}
              >
                <NavLink
                  to={path}
                  onClick={(e) => subItems && e.preventDefault()}
                  className={`flex items-center gap-3 h-full w-full flex-1 p-3 ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <span
                    className={`text-2xl ${
                      isActive
                        ? "text-white"
                        : "text-black group-hover:text-white"
                    }`}
                  >
                    {icon}
                  </span>
                  {!isCollapsed && (
                    <span
                      className={`${
                        isActive
                          ? "text-white"
                          : "text-black group-hover:text-white"
                      } text-sm`}
                    >
                      {name}
                    </span>
                  )}
                </NavLink>
                {!isCollapsed && subItems && (
                  <FaChevronDown
                    className={`text-xs transition-transform group-hover:text-white r-2 ${
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
                      const hasSubsub =
                        Array.isArray(sub.subsubItems) &&
                        sub.subsubItems.length > 0;
                      const subKey = `${name}-${sub.name}`;
                      const isSubExpanded = expandedSub === subKey;
                      const isSubActive =
                        location.pathname === sub.path ||
                        location.pathname.startsWith(sub.path + "/") ||
                        sub.subsubItems?.some(
                          (ss) =>
                            location.pathname === ss.path ||
                            location.pathname.startsWith(ss.path + "/")
                        );

                      return (
                        <div key={sub.name}>
                          <div
                            className={`flex items-center justify-between rounded-lg cursor-pointer ${
                              isSubActive
                                ? "bg-blue-500"
                                : "hover:bg-blue-500 hover:text-white group-hover:text-white"
                            }`}
                            onClick={() =>
                              hasSubsub && toggleSub(name, sub.name)
                            }
                          >
                            <NavLink
                              to={sub.path}
                              onClick={(e) => hasSubsub && e.preventDefault()}
                              className="flex-1 text-sm h-full w-full p-2"
                            >
                              <span
                                className={
                                  isSubActive
                                    ? "text-white"
                                    : "text-black group-hover:text-white"
                                }
                              >
                                {sub.name}
                              </span>
                            </NavLink>
                            {hasSubsub && (
                              <FaChevronDown
                                className={`text-xs transition-transform group-hover:text-white mr-2${
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
                              <div className="ml-4 mt-2 flex flex-col gap-1 groupp">
                                {sub.subsubItems!.map((ss) => {
                                  const isSSActive =
                                    location.pathname === ss.path ||
                                    location.pathname.startsWith(ss.path + "/");
                                  return (
                                    <NavLink
                                      key={ss.name}
                                      to={ss.path}
                                      className={`text-sm rounded-lg h-full w-full p-2 ${
                                        isSSActive
                                          ? "bg-blue-500 text-white"
                                          : "hover:bg-blue-500 hover:text-white groupp-hover:text-white"
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
