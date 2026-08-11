require("dotenv").config();

const nodemailer = require("nodemailer");

// Create a Gmail SMTP transporter using the App Password.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify the Gmail SMTP connection when needed.
async function verifyEmailService() {
  try {
    await transporter.verify();

    console.log("✅ Gmail SMTP connection verified successfully");

    return true;
  } catch (error) {
    console.error("❌ Gmail SMTP verification failed:");

    console.error(error);

    return false;
  }
}

// Send an email using the configured Gmail account.
async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: `"LedgerCore" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });

    console.log(`✅ Email sent to ${to}`);
    console.log(`📧 Message ID: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);

    throw error;
  }
}

// Send an email after a user successfully registers.
async function sendRegistrationEmail(email, name) {
  return sendEmail({
    to: email,
    subject: "Welcome to LedgerCore 🎉",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
        color: #18181b;
      ">

        <div style="
          text-align: center;
          margin-bottom: 30px;
        ">
          <h1 style="
            margin: 0;
            font-size: 28px;
          ">
            LedgerCore
          </h1>

          <p style="
            margin-top: 8px;
            color: #71717a;
          ">
            Your personal financial ledger
          </p>
        </div>

        <h2>
          Welcome to LedgerCore, ${name}! 🎉
        </h2>

        <p>
          Your LedgerCore account has been
          created successfully.
        </p>

        <div style="
          margin: 24px 0;
          padding: 20px;
          background: #f4f4f5;
          border-radius: 12px;
        ">
          <strong>
            Registration Successful
          </strong>

          <p style="margin-bottom: 0;">
            Your account is ready to use.
          </p>
        </div>

        <p>
          You can now manage your accounts,
          track transactions, and monitor
          your finances securely.
        </p>

        <p>
          Thanks for choosing LedgerCore.
        </p>

        <p>
          — LedgerCore Team
        </p>

      </div>
    `,

    text: `
Welcome to LedgerCore, ${name}!

Your LedgerCore account has been created successfully.

You can now manage your accounts, track transactions,
and monitor your finances securely.

Thanks for choosing LedgerCore.

— LedgerCore Team
    `,
  });
}

// Send an email when money is received or sent.
async function sendTransactionEmail({
  email,
  name,
  amount,
  direction,
  description,
  transactionId,
}) {
  const action = direction === "IN" ? "received" : "sent";

  return sendEmail({
    to: email,

    subject:
      direction === "IN"
        ? "Money received — LedgerCore"
        : "Transaction successful — LedgerCore",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
        color: #18181b;
      ">

        <div style="
          text-align: center;
          margin-bottom: 30px;
        ">
          <h1 style="
            margin: 0;
            font-size: 28px;
          ">
            LedgerCore
          </h1>

          <p style="
            margin-top: 8px;
            color: #71717a;
          ">
            Transaction Notification
          </p>
        </div>

        <h2>
          Transaction Successful
        </h2>

        <p>
          Hi ${name},
        </p>

        <p>
          Your LedgerCore account has
          successfully ${action} a transaction.
        </p>

        <div style="
          margin: 24px 0;
          padding: 20px;
          background: #f4f4f5;
          border-radius: 12px;
        ">

          <p style="margin: 0 0 8px;">
            <strong>Amount</strong>
          </p>

          <p style="
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 16px;
          ">
            ₹${Number(amount).toLocaleString("en-IN")}
          </p>

          ${
            description
              ? `
                <p style="margin: 0 0 8px;">
                  <strong>Description</strong>
                </p>

                <p style="margin: 0 0 16px;">
                  ${description}
                </p>
              `
              : ""
          }

          ${
            transactionId
              ? `
                <p style="margin: 0;">
                  <strong>Transaction ID:</strong>
                  ${transactionId}
                </p>
              `
              : ""
          }

        </div>

        <p>
          If you did not authorize this transaction,
          please review your LedgerCore account
          immediately.
        </p>

        <p>
          — LedgerCore Team
        </p>

      </div>
    `,

    text: `
Hi ${name},

Your LedgerCore account has successfully ${action} a transaction.

Amount: ₹${Number(amount).toLocaleString("en-IN")}

${description ? `Description: ${description}` : ""}

${transactionId ? `Transaction ID: ${transactionId}` : ""}

If you did not authorize this transaction,
please review your LedgerCore account immediately.

— LedgerCore Team
    `,
  });
}

module.exports = {
  sendEmail,
  sendRegistrationEmail,
  sendTransactionEmail,
  verifyEmailService,
};
