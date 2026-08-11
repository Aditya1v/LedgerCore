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

  const base64 = btoa(binary);

  doc.addFileToVFS("NotoSans-Regular.ttf", base64);

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

  const topMargin = 16;

  const bottomMargin = 28;

  let y = topMargin;

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
    if (!account) {
      return "N/A";
    }

    if (typeof account === "string") {
      return account;
    }

    return account.name || account.accountName || "N/A";
  };

  const drawOuterBorder = () => {
    doc.setDrawColor(190, 190, 190);

    doc.setLineWidth(0.5);

    doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 3, 3, "S");
  };

  const drawDivider = () => {
    doc.setDrawColor(205, 205, 205);

    doc.setLineWidth(0.35);

    doc.line(margin, y, pageWidth - margin, y);

    y += 7;
  };

  const drawSectionHeading = (title) => {
    y += 3;

    doc.setFont("NotoSans", "normal");

    doc.setFontSize(9);

    doc.setTextColor(75, 75, 75);

    doc.text(title.toUpperCase(), margin, y);

    y += 5;

    doc.setDrawColor(180, 180, 180);

    doc.setLineWidth(0.45);

    doc.line(margin, y, pageWidth - margin, y);

    y += 7;
  };

  const drawRow = (label, value, options = {}) => {
    const { valueBold = false, labelWidth = 55 } = options;

    doc.setFont("NotoSans", "normal");

    doc.setFontSize(9);

    doc.setTextColor(100, 100, 100);

    doc.text(label, margin, y);

    const valueText = safeText(value);

    const valueX = margin + labelWidth;

    const maxWidth = contentWidth - labelWidth;

    const wrappedValue = doc.splitTextToSize(valueText, maxWidth);

    doc.setFont("NotoSans", "normal");

    if (valueBold) {
      doc.setFont("NotoSans", "normal");
    }

    doc.setFontSize(9);

    doc.setTextColor(35, 35, 35);

    doc.text(wrappedValue, valueX, y);

    y += Math.max(6, wrappedValue.length * 4.5);
  };

  const drawAccountBox = (title, account) => {
    const boxHeight = 22;

    doc.setFillColor(249, 249, 249);

    doc.setDrawColor(210, 210, 210);

    doc.setLineWidth(0.4);

    doc.roundedRect(margin, y, contentWidth, boxHeight, 2.5, 2.5, "FD");

    doc.setFont("NotoSans", "normal");

    doc.setFontSize(7.5);

    doc.setTextColor(105, 105, 105);

    doc.text(title.toUpperCase(), margin + 6, y + 7);

    doc.setFontSize(10);

    doc.setTextColor(35, 35, 35);

    doc.text(getAccountName(account), margin + 6, y + 15);

    y += boxHeight + 6;
  };

  const drawStatus = () => {
    const statusText = safeText(transaction.status).toUpperCase();

    const statusWidth = 31;

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

    doc.setFont("NotoSans", "normal");

    doc.setFontSize(7.5);

    doc.setTextColor(35, 125, 65);

    doc.text(statusText, pageWidth - margin - statusWidth / 2, y, {
      align: "center",
    });
  };

  const drawHeader = () => {
    doc.setFont("NotoSans", "normal");

    doc.setFontSize(21);

    doc.setTextColor(25, 25, 25);

    doc.text("LedgerCore", margin, y);

    doc.setFontSize(8);

    doc.setTextColor(110, 110, 110);

    doc.text("Digital Banking Ledger", margin, y + 5);

    doc.setFontSize(8);

    doc.setTextColor(80, 80, 80);

    doc.text("TRANSACTION RECEIPT", pageWidth - margin, y, {
      align: "right",
    });

    y += 14;

    drawDivider();
  };

  const drawFooter = () => {
    const footerY = pageHeight - 19;

    doc.setDrawColor(205, 205, 205);

    doc.setLineWidth(0.35);

    doc.line(margin, footerY - 6, pageWidth - margin, footerY - 6);

    doc.setFont("NotoSans", "normal");

    doc.setFontSize(7);

    doc.setTextColor(115, 115, 115);

    doc.text(
      "This is an electronically generated transaction receipt.",
      margin,
      footerY,
    );

    doc.text("No signature is required.", margin, footerY + 4);

    doc.setFontSize(7.5);

    doc.setTextColor(65, 65, 65);

    doc.text("LedgerCore", pageWidth - margin, footerY, {
      align: "right",
    });

    doc.setFontSize(6.5);

    doc.setTextColor(115, 115, 115);

    doc.text(
      `Generated on ${formatDate(new Date())}`,
      pageWidth - margin,
      footerY + 4,
      {
        align: "right",
      },
    );
  };

  const hasSpace = (requiredHeight) => {
    return y + requiredHeight < pageHeight - bottomMargin;
  };

  const ensureSpace = (requiredHeight) => {
    if (!hasSpace(requiredHeight)) {
      drawFooter();

      doc.addPage();

      y = topMargin;

      drawOuterBorder();
      drawHeader();
    }
  };

  drawOuterBorder();
  drawHeader();

  // Display the transaction status.
  ensureSpace(20);

  doc.setFont("NotoSans", "normal");

  doc.setFontSize(11);

  doc.setTextColor(35, 35, 35);

  doc.text("Transaction Successful", margin, y);

  drawStatus();

  y += 10;

  // Highlight the transaction amount.
  ensureSpace(40);

  doc.setFillColor(248, 248, 248);

  doc.setDrawColor(200, 200, 200);

  doc.setLineWidth(0.45);

  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, "FD");

  doc.setFont("NotoSans", "normal");

  doc.setFontSize(7.5);

  doc.setTextColor(105, 105, 105);

  doc.text("AMOUNT", pageWidth / 2, y + 9, {
    align: "center",
  });

  doc.setFontSize(20);

  doc.setTextColor(25, 25, 25);

  doc.text(formatCurrency(transaction.amount), pageWidth / 2, y + 23, {
    align: "center",
  });

  y += 40;

  // Transaction information.
  ensureSpace(55);

  drawSectionHeading("Transaction Details");

  drawRow("Transaction ID", transaction._id);

  drawRow(
    "Date & Time",
    formatDate(transaction.createdAt || transaction.transactionDate),
  );

  drawRow("Transaction Type", transaction.transactionType);

  drawRow("Direction", transaction.direction);

  drawRow("Status", transaction.status);

  if (transaction.category) {
    drawRow("Category", transaction.category);
  }

  // Source and destination accounts.
  ensureSpace(65);

  drawSectionHeading("Account Details");

  drawAccountBox("From Account", transaction.fromAccount);

  drawAccountBox("To Account", transaction.toAccount);

  // Optional transaction description.
  if (transaction.description) {
    ensureSpace(35);

    drawSectionHeading("Payment Details");

    drawRow("Description", transaction.description);
  }

  // Display ledger entries without allowing them to overlap the footer.
  if (
    Array.isArray(transaction.ledgerEntries) &&
    transaction.ledgerEntries.length
  ) {
    ensureSpace(20 + transaction.ledgerEntries.length * 12);

    drawSectionHeading("Ledger Entries");

    transaction.ledgerEntries.forEach((entry) => {
      ensureSpace(14);

      const accountName = getAccountName(entry.account);

      const amount = formatCurrency(entry.amount);

      drawRow(safeText(entry.type), `${accountName} — ${amount}`);
    });
  }

  // Place the footer only after all content has been rendered.
  drawFooter();

  doc.save(`LedgerCore_Transaction_${transaction._id}.pdf`);
}
