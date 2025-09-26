import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import type { DeletePopupProps } from "../types/ComponentTypes";

const DeletePopup = ({
  open,
  onClose,
  onDelete,
  deleting,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  item,
}: DeletePopupProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded shadow max-w-md w-full z-10">
        <div className="flex items-center justify-between p-4 border-b border-gray mx-4">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <button
            onClick={onClose}
            className={`text-black ${
              deleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={deleting}
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaExclamationTriangle className="text-red text-xl" />
            </div>
            <div>
              <p className="text-black font-medium">{description}</p>
            </div>
          </div>

          {item && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {item.name && (
                <p className="text-black text-sm">Branch name: {item.name}</p>
              )}
              {item.location && (
                <p className="text-black text-sm">
                  Located at: {item.location}
                </p>
              )}
              {(item.staffCount !== undefined ||
                item.orderCount !== undefined) && (
                <div className="flex space-x-4 text-sm text-black">
                  {item.staffCount !== undefined && (
                    <span>{item.staffCount} staff members</span>
                  )}
                  {item.orderCount !== undefined && (
                    <span>{item.orderCount} orders</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-4 border-t border-gray mx-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm border border-gray rounded-md text-black ${
              deleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className={`px-4 py-2 bg-red text-sm text-white rounded-md ${
              deleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
