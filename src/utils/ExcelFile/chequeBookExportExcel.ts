import { message } from "ant-design-vue";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const exportToExcel = (
  data: any[],
  fileName: string = "export",
  sheetName: string = "Sheet1"
) => {
  if (!Array.isArray(data) || data.length === 0) {
    message.warning("No data to export");
    return;
  }

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate binary data (Excel buffer)
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Convert to Blob and trigger download
  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, `${fileName}.xlsx`);

  message.success(`Exported ${data.length} records to ${fileName}.xlsx`);
};
