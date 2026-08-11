require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM;

async function sendEmail({ to, subject, html, text }) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error("❌ Resend email error:", error);
      throw new Error(error.message || "Email sending failed");
    }

    console.log(`✅ Email sent to ${to}: ${data.id}`);

    return data;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);

    throw error;
  }
}

/**
 * Registration email
 */
async function sendRegistrationEmail(email, name) {
  return sendEmail({
    to: email,

    subject: "Welcome to LedgerCore 🎉",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        color: #18181b;
      ">

        <h2>
          Welcome to LedgerCore, ${name}!
        </h2>

        <p>
          Your LedgerCore account has been
          created successfully.
        </p>

        <p>
          You can now manage your accounts,
          track transactions, and monitor
          your finances securely.
        </p>

        <div style="
          margin: 24px 0;
          padding: 16px;
          background: #f4f4f5;
          border-radius: 10px;
        ">
          <strong>
            Registration successful
          </strong>

          <br />

          Your account is ready to use.
        </div>

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

/**
 * Transaction email
 */
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
        color: #18181b;
      ">

        <h2>
          Transaction successful
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
};
