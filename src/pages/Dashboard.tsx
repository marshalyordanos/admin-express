import Shipment from "../features/dashboard/components/Shipment";
import Revenue from "../features/dashboard/components/Revenue";
import Rating from "../features/dashboard/components/Rating";
import Performance from "../features/dashboard/components/Performance";
import Agent from "../features/dashboard/components/Agent";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    console.log("Dashboard");
  }, []);
  return (
    <div className="">
      <Shipment />
      <div className="flex">
        <div className="w-3/4">
          <Revenue />
        </div>
        <div className="w-1/4">
          <Rating />
        </div>
      </div>
      <Performance />
      <Agent />
    </div>
  );
};

export default Dashboard;
