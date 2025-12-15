import Button from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/utils/spinner";

export default function ActionButtons({isEditing, loading}: {isEditing?: boolean, loading?: boolean}) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h2 className="text-lg font-medium mb-4">Complete Configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center w-full">
              <Spinner className="h-6 w-6 text-white mr-2" />
              <span>{isEditing ? "Updating..." : "Saving..."}</span>
            </span>
          ) : (
            `${isEditing ? "Update" : "Save"} Configuration`
          )}
        </Button>
        <Button
          type="button"
          onClick={() => navigate("/pricing")}
          disabled={loading}
          className="bg-gray-100 hover:bg-gray-200 cursor-pointer !text-black border border-gray-300 !w-full disabled:opacity-50"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
