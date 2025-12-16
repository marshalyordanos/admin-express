import Button from "@/components/common/Button";
import { useNavigate } from "react-router-dom";

export default function ActionButtons({isEditing}:any) {
  const navigate = useNavigate();
  console.log(isEditing)

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h2 className="text-lg font-medium mb-4">Complete Configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button type="submit" className="cursor-pointer hover:bg-blue-700">
          {isEditing?"Update":"Save"} Configuration
        </Button>
        <Button
          type="button"
          onClick={() => navigate("/pricing")}
          className="bg-gray-100 hover:bg-gray-200 cursor-pointer !text-black border border-gray-300 !w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
