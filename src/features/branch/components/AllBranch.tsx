import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import Loading from "../../../components/common/Loading";
import {
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaBox,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Pagination from "../../../components/Pagination";
import DeletePopup from "../../../components/DeletePopup";
import Th from "../../../components/common/Th";
import Td from "../../../components/common/Td";
import StatCard from "../../../components/StateCard";
import type { Staff, Branch, PaginationType } from "../types";

const AllBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Fetch branches
  useEffect(() => {
    setLoading(true);
    api
      .get(`/branch?page=${pagination?.page || 1}`)
      .then((response) => {
        const { success, data, pagination: newPagination } = response.data;
        if (success) {
          setBranches(data);
          setPagination(newPagination);
        } else {
          setError("Failed to fetch branches");
        }
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  }, [pagination?.page]);

  // Filter branches
  const filteredBranches = searchQuery
    ? branches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : branches;

  // Delete branch
  const handleDeleteBranch = async () => {
    if (!branchToDelete) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/branch/${branchToDelete.id}`);
      if (response.data.success) {
        setBranches((prev) =>
          prev.filter((branch) => branch.id !== branchToDelete.id)
        );
        setPagination((prev) =>
          prev ? { ...prev, total: prev.total - 1 } : prev
        );
        setDeleteModalOpen(false);
        setBranchToDelete(null);
      } else {
        setError("Failed to delete branch");
      }
    } catch {
      setError("Something went wrong while deleting the branch");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10 font-medium">{error}</div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        All Branches
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Manage all your branches in one place
      </p>

      <div className="border border-gray rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search branches by name or location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {filteredBranches.length} branches found
          </span>
          <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
            Total: {pagination?.total || branches.length}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FaMapMarkerAlt className="text-blue-600 text-xl" />}
          label="Total Branches"
          value={pagination?.total || branches.length}
          bg="bg-blue-100"
        />
        <StatCard
          icon={<FaUsers className="text-green-600 text-xl" />}
          label="Total Staff"
          value={branches.reduce((acc, branch) => acc + branch.staff.length, 0)}
          bg="bg-green-100"
        />
        <StatCard
          icon={<FaBox className="text-purple-600 text-xl" />}
          label="Total Orders"
          value={branches.reduce(
            (acc, branch) => acc + branch.orders.length,
            0
          )}
          bg="bg-purple-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <Th>No</Th>
                <Th>Branch Details</Th>
                <Th>Location</Th>
                <Th>Manager Status</Th>
                <Th>Orders</Th>
                <Th>Staff</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBranches.map((branch, idx) => (
                <tr key={branch.id}>
                  <Td>{idx + 1}</Td>
                  <Td>{branch.name}</Td>
                  <Td>{branch.location}</Td>
                  <Td>
                    <div className="flex items-center">
                      {branch.managerId ? (
                        <FaUserCheck className="text-green mr-2" />
                      ) : (
                        <FaUserTimes className="text-red mr-2" />
                      )}
                      <span className="text-sm text-black">
                        {branch.managerId ? "Assigned" : "Not Assigned"}
                      </span>
                    </div>
                  </Td>
                  <Td>{branch.orders.length}</Td>
                  <Td>{branch.staff.length}</Td>
                  <Td>
                    <button
                      onClick={() => navigate(`/branch/update/${branch.id}`)}
                      className="px-3 py-1 text-xs cursor-pointer bg-blue-100 text-darkblue rounded-md hover:bg-blue-200"
                    >
                      Edit
                    </button>
                  </Td>
                  <Td>
                    <button
                      onClick={() => {
                        setBranchToDelete(branch);
                        setDeleteModalOpen(true);
                      }}
                      className="px-3 py-1 text-xs cursor-pointer bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* No Results */}
        {filteredBranches.length === 0 && (
          <div className="text-center py-10">
            <FaMapMarkerAlt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">
              No branches found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search query
            </p>
          </div>
        )}
        {/* Pagination */}
        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) =>
              setPagination((prev) =>
                prev ? { ...prev, page: newPage } : prev
              )
            }
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePopup
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBranchToDelete(null);
          setDeleting(false);
        }}
        onDelete={handleDeleteBranch}
        deleting={deleting}
        title="Confirm Deletion"
        description="Are you sure you want to delete this branch? This action cannot be undone."
        item={
          branchToDelete
            ? {
                name: branchToDelete.name,
                location: branchToDelete.location,
                staffCount: branchToDelete.staff.length,
                orderCount: branchToDelete.orders.length,
              }
            : undefined
        }
      />
    </div>
  );
};

export default AllBranches;
