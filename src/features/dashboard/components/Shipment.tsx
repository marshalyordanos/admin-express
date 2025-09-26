import { FaTruck, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const Shipment = () => {
  const stats = [
    {
      title: "Active",
      value: "3,120",
      change: "+5.6%",
      changeColor: "text-blue-500",
      changeBg: "bg-blue-100",
      extra: "Currently in transit",
      icon: <FaTruck className="text-blue-500" />,
    },
    {
      title: "Delivered",
      value: "8,900",
      change: "+9.8%",
      changeColor: "text-green-600",
      changeBg: "bg-green-100",
      extra: "Delivered successfully this year",
      icon: <FaCheckCircle className="text-green-600" />,
    },
    {
      title: "Delayed",
      value: "320",
      change: "-2.4%",
      changeColor: "text-yellow-600",
      changeBg: "bg-yellow-100",
      extra: "Shipments delayed this year",
      icon: <FaClock className="text-yellow-600" />,
    },
    {
      title: "Canceled",
      value: "110",
      change: "-1.2%",
      changeColor: "text-red-600",
      changeBg: "bg-red-100",
      extra: "Shipments canceled this year",
      icon: <FaTimesCircle className="text-red-600" />,
    },
  ];

  return (
    <div className="font-text">
      <p className="pb-4 text-base font-semibold">Total Shipment</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <span
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${stat.changeBg} ${stat.changeColor}`}
              >
                {stat.change}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {stat.value}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {stat.icon}
              <span>{stat.extra}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray rounded-lg shadow p-6 text-black mt-6 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-base mb-2">Shipment Performance Summary</h3>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-2 bg-darkblue text-sm cursor-pointer text-white rounded-full">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shipment;
