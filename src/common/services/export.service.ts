import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
const PDFDocument = require('pdfkit');
import { Response } from 'express';

@Injectable()
export class ExportService {
  async exportToExcel(
    data: any[],
    columns: { header: string; key: string; width?: number }[],
    fileName: string,
    res: Response,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.columns = columns;
    worksheet.addRows(data);

    // Style header
    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportToPdf(
    data: any[],
    columns: string[],
    fileName: string,
    res: Response,
  ) {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.pdf`,
    );

    doc.pipe(res);

    doc.fontSize(20).text('Data Export', { align: 'center' });
    doc.moveDown();

    // Simple table-like structure
    data.forEach((item, index) => {
      let rowText = `${index + 1}. `;
      columns.forEach((col) => {
        rowText += `${col}: ${item[col]} | `;
      });
      doc.fontSize(12).text(rowText);
      doc.moveDown(0.5);
    });

    doc.end();
  }
}
