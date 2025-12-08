import { Field } from "formik";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DriverCommission {
  category: string;
  fixedCost: number;
  driverCost: number;
}

interface DriverCommissionTableProps {
  driverCommission: DriverCommission[];
}

export default function DriverCommissionTable({
  driverCommission,
}: DriverCommissionTableProps) {
  return (
    <div className="mt-6">
      <h3 className="text-md font-medium mb-4">Driver Commission</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-600 font-medium border border-gray-200">
                Vehicle Category
              </TableHead>
              <TableHead className="text-gray-600 font-medium border border-gray-200">
                Fixed Cost ($)
              </TableHead>
              <TableHead className="text-gray-600 font-medium border border-gray-200">
                Driver Cost ($)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driverCommission.map((commission, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium capitalize border border-gray-200">
                  {commission.name}
                </TableCell>
                <TableCell className="border border-gray-200">
                  <Field
                    as={Input}
                    type="number"
                    step="0.01"
                    name={`driverCommission.${index}.fixedCost`}
                    placeholder="Fixed cost"
                    className="py-2 border-0 shadow-none focus-visible:outline-none focus-visible:ring-0 focus:outline-none focus:ring-0"
                  />
                </TableCell>
                <TableCell className="border border-gray-200">
                  <Field
                    as={Input}
                    type="number"
                    step="0.01"
                    name={`driverCommission.${index}.driverCost`}
                    placeholder="Driver cost"
                    className="py-2 border-0 shadow-none focus-visible:outline-none focus-visible:ring-0 focus:outline-none focus:ring-0"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

