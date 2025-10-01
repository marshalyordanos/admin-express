import { useState } from "react";
import { FaChartLine, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import TablePagination from "@/components/common/TablePagination";
import type { BranchData } from "../types";

const Performance = () => {
  const data: BranchData[] = [
    {
      name: "Addis Ababa",
      completed: 1200,
      delayed: 45,
      revenue: 85000,
      efficiency: 96,
      trend: "up",
    },
    {
      name: "Dire Dawa",
      completed: 950,
      delayed: 30,
      revenue: 60000,
      efficiency: 97,
      trend: "up",
    },
    {
      name: "Mekelle",
      completed: 780,
      delayed: 50,
      revenue: 40000,
      efficiency: 94,
      trend: "down",
    },
    {
      name: "Bahir Dar",
      completed: 670,
      delayed: 25,
      revenue: 38000,
      efficiency: 96,
      trend: "up",
    },
    {
      name: "Hawassa",
      completed: 800,
      delayed: 40,
      revenue: 42000,
      efficiency: 95,
      trend: "up",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortColumn, setSortColumn] = useState<keyof BranchData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSort = (column: keyof BranchData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="w-full bg-white p-6 font-text">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-2">
          <FaChartLine className="text-blue-500" size={20} />
          <p className="text-base font-bold text-gray-900">
            City Performance Overview
          </p>
        </div>
      </div>

      {/* Cities Performance Table */}
      <Card className="bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-600 font-medium">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  City Name
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </div>
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("completed")}
                >
                  Completed Orders
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </div>
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("delayed")}
                >
                  Delayed Orders
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </div>
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("revenue")}
                >
                  Revenue
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </div>
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("efficiency")}
                >
                  Efficiency
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </div>
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((city, index) => (
              <TableRow
                key={index}
                className="border-gray-100 hover:bg-gray-50"
              >
                <TableCell className="font-medium text-gray-900">
                  {city.name}
                </TableCell>
                <TableCell className="text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {city.completed.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-900">
                  <Badge
                    variant="secondary"
                    className={
                      city.delayed < 40
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {city.delayed.toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  ${city.revenue.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${city.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {city.efficiency}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      city.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {city.trend === "up" ? (
                      <span className="flex items-center gap-1">
                        <FaSortAmountUp className="h-3 w-3" />
                        Improving
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <FaSortAmountDown className="h-3 w-3" />
                        Declining
                      </span>
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 15, 20]}
        />
      </Card>
    </div>
  );
};

export default Performance;
