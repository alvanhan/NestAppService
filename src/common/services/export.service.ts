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
    title?: string,
    summary?: Record<string, any>,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    let currentRow = 1;

    if (title) {
      const titleRow = worksheet.getRow(currentRow);
      titleRow.getCell(1).value = title;
      titleRow.font = { bold: true, size: 16 };
      currentRow += 2;
    }

    if (summary) {
      Object.entries(summary).forEach(([key, value]) => {
        const row = worksheet.getRow(currentRow);
        row.getCell(1).value = key;
        row.getCell(2).value = value;
        row.font = { italic: true };
        currentRow++;
      });
      currentRow += 1;
    }

    const headerRow = worksheet.getRow(currentRow);
    columns.forEach((col, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = col.header;
      cell.font = { bold: true };
      worksheet.getColumn(index + 1).width = col.width || 15;
      worksheet.getColumn(index + 1).key = col.key;
    });
    currentRow++;

    data.forEach((item) => {
      const row = worksheet.getRow(currentRow);
      columns.forEach((col, index) => {
        row.getCell(index + 1).value = item[col.key];
      });
      currentRow++;
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportToPdf(
    data: any[],
    columns: string[],
    fileName: string,
    res: Response,
    title?: string,
    summary?: Record<string, any>,
  ) {
    const doc = new PDFDocument({ margin: 30 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    doc.pipe(res);

    if (title) {
      doc.fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
    }

    if (summary) {
      doc.fontSize(10);
      Object.entries(summary).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`);
      });
      doc.moveDown();
    }

    const startX = 30;
    const startY = doc.y;
    const colWidth = 450 / columns.length;
    const rowHeight = 20;

    doc.fontSize(10).font('Helvetica-Bold');
    columns.forEach((col, i) => {
      doc.text(col.toUpperCase(), startX + i * colWidth, startY, {
        width: colWidth,
        align: 'left',
      });
    });

    doc
      .moveTo(startX, startY + 15)
      .lineTo(startX + 450, startY + 15)
      .stroke();

    let currentY = startY + 20;

    doc.font('Helvetica');
    data.forEach((item) => {
      if (currentY > doc.page.height - 50) {
        doc.addPage();
        currentY = 30;
      }

      columns.forEach((col, i) => {
        let value = item[col];
        if (col === 'price') value = `Rp ${value.toLocaleString('id-ID')}`;

        doc.text(String(value), startX + i * colWidth, currentY, {
          width: colWidth,
          align: 'left',
        });
      });
      currentY += 15;
    });

    doc.end();
  }
}
