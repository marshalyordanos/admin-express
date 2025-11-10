// src/utils/exportToExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Generic Excel export function
 * @param fileName - name of the Excel file
 * @param data - array of data to export
 * @param formatFn - optional formatter for each row
 */
export function exportToExcel<T>(
  fileName: string,
  data: T[],
  formatFn?: (item: T) => any
) {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  console.log("formatFn", formatFn);
  const formattedData = formatFn ? data.map(formatFn) : data;
  console.log("formattedData", formattedData);

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
}
