import { jsPDF } from "jspdf";
import { formatCurrency } from "./formatCurrency";

export function generateTransactionReceipt(transaction) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = 18;

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

  const drawDivider = () => {
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.4);

    doc.line(margin, y, pageWidth - margin, y);

    y += 8;
  };

  const drawSectionHeading = (title) => {
    y += 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);

    doc.text(title.toUpperCase(), margin, y);

    y += 6;

    doc.setDrawColor(190, 190, 190);
    doc.setLineWidth(0.5);

    doc.line(margin, y, pageWidth - margin, y);

    y += 9;
  };

  const drawRow = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);

    doc.text(label, margin, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(35, 35, 35);

    const valueText = safeText(value);

    const maxWidth = contentWidth * 0.55;

    const wrappedValue = doc.splitTextToSize(valueText, maxWidth);

    doc.text(wrappedValue, pageWidth - margin, y, {
      align: "right",
    });

    y += Math.max(7, wrappedValue.length * 5);
  };

  const drawAccountBox = (title, account) => {
    const boxHeight = 25;

    doc.setFillColor(248, 248, 248);

    doc.setDrawColor(215, 215, 215);

    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, "FD");

    doc.setFont("helvetica", "bold");

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    doc.text(title.toUpperCase(), margin + 6, y + 8);

    doc.setFontSize(11);
    doc.setTextColor(35, 35, 35);

    doc.text(safeText(account?.name), margin + 6, y + 17);

    y += boxHeight + 8;
  };

  // Header
  doc.setFont("helvetica", "bold");

  doc.setFontSize(22);
  doc.setTextColor(25, 25, 25);

  doc.text("LedgerCore", margin, y);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);

  doc.text("Digital Banking Ledger", margin, y + 6);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);

  doc.text("TRANSACTION RECEIPT", pageWidth - margin, y, {
    align: "right",
  });

  y += 16;

  drawDivider();

  // Transaction status
  doc.setFont("helvetica", "bold");

  doc.setFontSize(12);
  doc.setTextColor(35, 35, 35);

  doc.text("✓  Transaction Successful", margin, y);

  y += 10;

  // Amount box
  doc.setFillColor(248, 248, 248);

  doc.setDrawColor(200, 200, 200);

  doc.roundedRect(margin, y, contentWidth, 34, 4, 4, "FD");

  doc.setFont("helvetica", "normal");

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);

  doc.text("AMOUNT", pageWidth / 2, y + 10, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");

  doc.setFontSize(22);
  doc.setTextColor(25, 25, 25);

  doc.text(formatCurrency(transaction.amount), pageWidth / 2, y + 25, {
    align: "center",
  });

  y += 45;

  // Transaction details
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

  // Account details
  drawSectionHeading("Account Details");

  drawAccountBox("From Account", transaction.fromAccount);

  drawAccountBox("To Account", transaction.toAccount);

  // Description
  if (transaction.description) {
    drawSectionHeading("Payment Details");

    drawRow("Description", transaction.description);
  }

  // Ledger entries
  if (
    Array.isArray(transaction.ledgerEntries) &&
    transaction.ledgerEntries.length
  ) {
    drawSectionHeading("Ledger Entries");

    transaction.ledgerEntries.forEach((entry) => {
      drawRow(
        entry.type,
        `${safeText(entry.account?.name)} — ${formatCurrency(entry.amount)}`,
      );
    });
  }

  // Footer
  const footerY = pageHeight - 25;

  doc.setDrawColor(210, 210, 210);

  doc.setLineWidth(0.4);

  doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);

  doc.text(
    "This is an electronically generated transaction receipt.",
    margin,
    footerY,
  );

  doc.text("No signature is required.", margin, footerY + 5);

  doc.setFont("helvetica", "bold");

  doc.text("LedgerCore", pageWidth - margin, footerY, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");

  doc.text(
    `Generated on ${formatDate(new Date())}`,
    pageWidth - margin,
    footerY + 5,
    {
      align: "right",
    },
  );

  doc.save(`LedgerCore_Transaction_${transaction._id}.pdf`);
}
