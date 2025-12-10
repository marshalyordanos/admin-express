import { Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import WeightRangesTable from "./WeightRangesTable";

interface WeightRange {
  from: string;
  to: string;
  price: number;
}

interface ServiceTypeSectionProps {
  serviceName: string;
  serviceLabel: string;
  fieldName: string;
  weightRanges: WeightRange[];
  selectedRows: Set<number>;
  onSelectionChange: (selectedRows: Set<number>) => void;
  onAddRange: () => void;
  onDeleteSelected: () => void;
  fieldPrefix: string;
  error?: string;
  touched?: boolean;
  incrementValue?: number;
  isExpanded: boolean;
  onToggle: () => void;
  hasWeight?:boolean
}

export default function ServiceTypeSection({
  serviceName,
  serviceLabel,
  fieldName,
  weightRanges,
  selectedRows,
  onSelectionChange,
  onAddRange,
  onDeleteSelected,
  fieldPrefix,
  error,
  touched,
  incrementValue = 5,
  isExpanded,
  onToggle,
  hasWeight=true,
}: ServiceTypeSectionProps) {

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">{serviceName}</h2>
        <button
          type="button"
          className="p-2 !bg-gray-200 rounded-lg cursor-pointer transition-colors"
          onClick={onToggle}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4">
            <Label className="mb-1">{serviceLabel} ($)</Label>
            <Field
              as={Input}
              type="number"
              step="0.01"
              name={fieldName}
              placeholder={`Enter ${serviceLabel.toLowerCase()}`}
              className={`py-2 !w-1/2 ${error && touched ? "border-red-500" : ""}`}
            />
            {error && touched && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
{hasWeight&&
          <WeightRangesTable
            weightRanges={weightRanges}
            selectedRows={selectedRows}
            onSelectionChange={onSelectionChange}
            onAddRange={onAddRange}
            onDeleteSelected={onDeleteSelected}
            fieldPrefix={fieldPrefix}
            incrementValue={incrementValue}
          />}
        </>
      )}
    </div>
  );
}

