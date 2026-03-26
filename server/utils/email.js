const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmation = async (email, order) => {
  const itemLines = order.items
    .map((item) => `  ${item.name} x${item.quantity} — £${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  await transporter.sendMail({
    from: `Tea and Cake Productions <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Your order confirmation — Tea and Cake Productions",
    text: `Thank you for your order!\n\n${itemLines}\n\nTotal: £${order.total.toFixed(2)}\n\nWe'll be in touch once your order has been shipped.`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto; color: #111;">
        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 12px;">Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          ${order.items
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0;">${item.name}</td>
              <td style="padding: 10px 0; color: #999;">x${item.quantity}</td>
              <td style="padding: 10px 0; text-align: right;">£${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`
            )
            .join("")}
        </table>
        <p style="text-align: right; font-weight: bold;">Total: £${order.total.toFixed(2)}</p>
        <p style="color: #666; font-size: 0.9rem;">We'll be in touch once your order has been shipped.</p>
      </div>
    `,
  });
};

module.exports = { sendOrderConfirmation };
