import { jsPDF } from "jspdf";
import { formatCurrency } from "./formatCurrency";

async function loadFont(doc) {
  const response = await fetch("/fonts/NotoSans-Regular.ttf");

  if (!response.ok) {
    throw new Error("Failed to load Noto Sans font");
  }

  const fontBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(fontBuffer);

  let binary = "";

  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }

  doc.addFileToVFS("NotoSans-Regular.ttf", btoa(binary));

  doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");

  doc.setFont("NotoSans", "normal");
}

export async function generateTransactionReceipt(transaction) {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  await loadFont(doc);

  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  let y = 15;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const safeText = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    return String(value);
  };

  const getAccountName = (account) => {
    if (!account) return "N/A";

    if (typeof account === "string") {
      return account;
    }

    return account.name || account.accountName || "N/A";
  };

  const setFont = (size, color = [35, 35, 35]) => {
    doc.setFont("NotoSans", "normal");

    doc.setFontSize(size);

    doc.setTextColor(...color);
  };

  const drawSectionTitle = (title) => {
    setFont(8.5, [75, 75, 75]);

    doc.text(title.toUpperCase(), margin, y);

    y += 3;

    doc.setDrawColor(190, 190, 190);

    doc.setLineWidth(0.35);

    doc.line(margin, y, pageWidth - margin, y);

    y += 6;
  };

  const drawDetailRow = (label, value, x, valueX, width) => {
    setFont(7.8, [105, 105, 105]);

    doc.text(label, x, y);

    setFont(8, [35, 35, 35]);

    const wrapped = doc.splitTextToSize(safeText(value), width);

    doc.text(wrapped, valueX, y);
  };

  const drawAccountBox = (title, account, x, width) => {
    doc.setFillColor(248, 248, 248);

    doc.setDrawColor(210, 210, 210);

    doc.setLineWidth(0.4);

    doc.roundedRect(x, y, width, 24, 2.5, 2.5, "FD");

    setFont(7, [105, 105, 105]);

    doc.text(title.toUpperCase(), x + 6, y + 7);

    setFont(9.5, [35, 35, 35]);

    const accountName = getAccountName(account);

    doc.text(accountName, x + 6, y + 16);
  };

  const drawLedgerTable = () => {
    if (
      !Array.isArray(transaction.ledgerEntries) ||
      transaction.ledgerEntries.length === 0
    ) {
      return;
    }

    drawSectionTitle("Ledger Entries");

    const tableX = margin;
    const tableWidth = contentWidth;

    const typeWidth = 28;
    const accountWidth = tableWidth - typeWidth - 42;

    const amountWidth = 42;

    const rowHeight = 8;

    doc.setFillColor(245, 245, 245);

    doc.setDrawColor(205, 205, 205);

    doc.rect(tableX, y, tableWidth, rowHeight, "FD");

    setFont(7, [75, 75, 75]);

    doc.text("TYPE", tableX + 5, y + 5);

    doc.text("ACCOUNT", tableX + typeWidth + 5, y + 5);

    doc.text(
      "AMOUNT",
      tableX + typeWidth + accountWidth + amountWidth - 5,
      y + 5,
      {
        align: "right",
      },
    );

    y += rowHeight;

    transaction.ledgerEntries.forEach((entry, index) => {
      const rowY = y;

      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);

        doc.rect(tableX, rowY, tableWidth, rowHeight, "F");
      }

      doc.setDrawColor(220, 220, 220);

      doc.rect(tableX, rowY, tableWidth, rowHeight, "S");

      setFont(7.5, [55, 55, 55]);

      doc.text(safeText(entry.type), tableX + 5, rowY + 5);

      doc.text(getAccountName(entry.account), tableX + typeWidth + 5, rowY + 5);

      doc.text(
        formatCurrency(entry.amount),
        tableX + tableWidth - 5,
        rowY + 5,
        {
          align: "right",
        },
      );

      y += rowHeight;
    });

    y += 5;
  };

  // Outer receipt border.
  doc.setDrawColor(175, 175, 175);

  doc.setLineWidth(0.6);

  doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 3, 3, "S");

  // Header.
  setFont(20, [25, 25, 25]);

  doc.text("LedgerCore", margin, y);

  setFont(7.5, [110, 110, 110]);

  doc.text("Digital Banking Ledger", margin, y + 5);

  setFont(8, [80, 80, 80]);

  doc.text("TRANSACTION RECEIPT", pageWidth - margin, y, {
    align: "right",
  });

  y += 12;

  doc.setDrawColor(195, 195, 195);

  doc.setLineWidth(0.4);

  doc.line(margin, y, pageWidth - margin, y);

  y += 9;

  // Status row.
  setFont(10, [35, 35, 35]);

  doc.text("Transaction Successful", margin, y);

  const statusWidth = 32;

  doc.setFillColor(235, 248, 239);

  doc.setDrawColor(180, 220, 190);

  doc.roundedRect(
    pageWidth - margin - statusWidth,
    y - 6,
    statusWidth,
    9,
    2,
    2,
    "FD",
  );

  setFont(7, [35, 125, 65]);

  doc.text(
    safeText(transaction.status).toUpperCase(),
    pageWidth - margin - statusWidth / 2,
    y,
    {
      align: "center",
    },
  );

  y += 9;

  // Amount box.
  doc.setFillColor(248, 248, 248);

  doc.setDrawColor(200, 200, 200);

  doc.roundedRect(margin, y, contentWidth, 27, 3, 3, "FD");

  setFont(7, [105, 105, 105]);

  doc.text("AMOUNT", pageWidth / 2, y + 8, {
    align: "center",
  });

  setFont(19, [25, 25, 25]);

  doc.text(formatCurrency(transaction.amount), pageWidth / 2, y + 20, {
    align: "center",
  });

  y += 35;

  // Transaction details in two columns.
  drawSectionTitle("Transaction Details");

  const leftX = margin;
  const rightX = margin + contentWidth / 2;

  const leftValueX = leftX + 30;

  const rightValueX = rightX + 30;

  const columnWidth = contentWidth / 2 - 35;

  drawDetailRow(
    "Transaction ID",
    transaction._id,
    leftX,
    leftValueX,
    columnWidth,
  );

  drawDetailRow(
    "Date & Time",
    formatDate(transaction.createdAt || transaction.transactionDate),
    rightX,
    rightValueX,
    columnWidth,
  );

  y += 7;

  drawDetailRow(
    "Type",
    transaction.transactionType,
    leftX,
    leftValueX,
    columnWidth,
  );

  drawDetailRow(
    "Direction",
    transaction.direction,
    rightX,
    rightValueX,
    columnWidth,
  );

  y += 7;

  drawDetailRow(
    "Category",
    transaction.category || "N/A",
    leftX,
    leftValueX,
    columnWidth,
  );

  drawDetailRow("Status", transaction.status, rightX, rightValueX, columnWidth);

  y += 9;

  // Account details.
  drawSectionTitle("Account Details");

  const gap = 7;

  const accountBoxWidth = (contentWidth - gap) / 2;

  drawAccountBox(
    "From Account",
    transaction.fromAccount,
    margin,
    accountBoxWidth,
  );

  drawAccountBox(
    "To Account",
    transaction.toAccount,
    margin + accountBoxWidth + gap,
    accountBoxWidth,
  );

  y += 30;

  // Payment details.
  if (transaction.description) {
    drawSectionTitle("Payment Details");

    drawDetailRow(
      "Description",
      transaction.description,
      margin,
      margin + 35,
      contentWidth - 35,
    );

    y += 9;
  }

  // Ledger entries.
  drawLedgerTable();

  // Footer.
  const footerY = pageHeight - 20;

  doc.setDrawColor(205, 205, 205);

  doc.setLineWidth(0.35);

  doc.line(margin, footerY - 6, pageWidth - margin, footerY - 6);

  setFont(6.5, [115, 115, 115]);

  doc.text(
    "This is an electronically generated transaction receipt.",
    margin,
    footerY,
  );

  doc.text("No signature is required.", margin, footerY + 4);

  setFont(7, [65, 65, 65]);

  doc.text("LedgerCore", pageWidth - margin, footerY, {
    align: "right",
  });

  setFont(6, [115, 115, 115]);

  doc.text(
    `Generated on ${formatDate(new Date())}`,
    pageWidth - margin,
    footerY + 4,
    {
      align: "right",
    },
  );

  doc.save(`LedgerCore_Transaction_${transaction._id}.pdf`);
}
