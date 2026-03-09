import ExcelJS from 'exceljs';

import { formatDate } from '@/repairs/utils';
import { Repair } from '@/repairs/types';

const COLUMNS: Partial<ExcelJS.Column>[] = [
  { header: 'Ticket', key: 'ticket', width: 14 },
  { header: 'Date', key: 'date', width: 22 },
  { header: 'Customer', key: 'customer', width: 24 },
  { header: 'Phone', key: 'phone', width: 18 },
  { header: 'Items', key: 'items', width: 32 },
  { header: 'Specs', key: 'specs', width: 32 },
  { header: 'Status', key: 'status', width: 14 }
];

const defaultFilename = (): string => {
  const now = new Date();
  const pad = (number: number) => String(number).padStart(2, '0');
  const stamp = `${String(now.getFullYear())}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  return `repair-tracker-${stamp}`;
};

const buildWorkbook = (repairs: Repair[]): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Repairs');

  sheet.columns = COLUMNS;

  sheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
  });

  for (const repair of repairs) {
    sheet.addRow({
      ticket: repair.ticket,
      date: formatDate(repair.date),
      customer: repair.customer,
      phone: repair.phone ?? '',
      items: repair.items.join(', '),
      specs: repair.specs ?? '',
      status: repair.status
    });
  }

  return workbook;
};

const saveWithPicker = async (buffer: ArrayBuffer, filename: string): Promise<boolean> => {
  if (!window.showSaveFilePicker) {
    return false;
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `${filename}.xlsx`,
      types: [
        {
          description: 'Excel Spreadsheet',
          accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
        }
      ]
    });

    const writable = await handle.createWritable();

    await writable.write(buffer);
    await writable.close();

    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return true;
    }

    return false;
  }
};

const saveWithDownload = (buffer: ArrayBuffer, filename: string): void => {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${filename}.xlsx`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportRepairs = async (repairs: Repair[]): Promise<void> => {
  const workbook = buildWorkbook(repairs);
  const buffer = await workbook.xlsx.writeBuffer();
  const filename = defaultFilename();
  const saved = await saveWithPicker(buffer as ArrayBuffer, filename);

  if (!saved) {
    saveWithDownload(buffer as ArrayBuffer, filename);
  }
};
