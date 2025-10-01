import {
  FaTachometerAlt,
  FaTruck,
  FaCogs,
  FaExchangeAlt,
  FaCodeBranch,
  FaUsersCog,
  FaTruckLoading,
} from "react-icons/fa";
import { IoPricetags } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Branch Management",
    path: "/branch",
    icon: <FaCodeBranch />,
  },
  {
    name: "Staff Management",
    path: "/staff",
    icon: <FaUsersCog />,
  },
  {
    name: "Order Management",
    path: "/order",
    icon: <FaTruckLoading />,
  },
  {
    name: "Dispatch Management",
    path: "/dispatch",
    icon: <FaExchangeAlt />,
  },
  {
    name: "Fleet Management",
    path: "/fleet",
    icon: <FaTruck />,
  },
  {
    name: "Customer Management",
    path: "/customer",
    icon: <FaUsersCog />,
  },
  {
    name: "Pricing Management",
    path: "/pricing",
    icon: <IoPricetags />,
  },
  {
    name: "Report Generation",
    path: "/report",
    icon: <IoDocumentText />,
  },
  {
    name: "System Configuration",
    path: "/system",
    icon: <FaCogs />,
    subItems: [
      { name: "Fuel Alerts", path: "/alerts/fuel", icon: <FaCogs /> },
      { name: "Maintenance", path: "/alerts/maintenance", icon: <FaCogs /> },
      { name: "Delays", path: "/alerts/delays", icon: <FaCogs /> },
    ],
  },
  // {
  //   name: "Alerts",
  //   path: "/alerts",
  //   icon: <FaBell />,
  //   badge: "3",
  //   badgeColor: "bg-red-500",
  //   subItems: [
  //     { name: "Fuel Alerts", path: "/alerts/fuel", icon: <FaGasPump /> },
  //     { name: "Maintenance", path: "/alerts/maintenance", icon: <FaWrench /> },
  //     { name: "Delays", path: "/alerts/delays", icon: <FaBell /> },
  //   ],
  // },
];

export default menuItems;
