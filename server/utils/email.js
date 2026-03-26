const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatAddress = (addr) => {
  if (!addr) return "";
  return [addr.name, addr.line1, addr.line2, addr.city, addr.postcode]
    .filter(Boolean)
    .join(", ");
};

const itemsTableHtml = (items) =>
  items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0;">${item.name}</td>
      <td style="padding: 10px 0; color: #999;">x${item.quantity}</td>
      <td style="padding: 10px 0; text-align: right;">£${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");

// Sent to the customer after payment succeeds
const sendOrderConfirmation = async (email, order) => {
  const itemLines = order.items
    .map((item) => `  ${item.name} x${item.quantity} — £${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  const shippingLine = order.shippingCost
    ? `\n  Shipping — £${order.shippingCost.toFixed(2)}`
    : "";

  const addrText = order.shippingAddress
    ? `\nDelivering to: ${formatAddress(order.shippingAddress)}`
    : "";

  await transporter.sendMail({
    from: `Tea and Cake Productions <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Your order confirmation — Tea and Cake Productions",
    text: `Thank you for your order!\n\n${itemLines}${shippingLine}\n\nTotal: £${order.total.toFixed(2)}${addrText}\n\nWe aim to dispatch your order within 3–5 working days. We'll send you another email once it's on its way.`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto; color: #111;">
        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 12px;">Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          ${itemsTableHtml(order.items)}
          ${order.shippingCost ? `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #999;" colspan="2">Shipping</td>
            <td style="padding: 10px 0; text-align: right;">£${order.shippingCost.toFixed(2)}</td>
          </tr>` : ""}
        </table>
        <p style="text-align: right; font-weight: bold;">Total: £${order.total.toFixed(2)}</p>
        ${order.shippingAddress ? `
        <p style="color: #555; font-size: 0.9rem; margin-top: 24px;">
          <strong>Delivering to:</strong><br>
          ${formatAddress(order.shippingAddress).split(", ").join("<br>")}
        </p>` : ""}
        <p style="color: #666; font-size: 0.9rem; margin-top: 24px;">We aim to dispatch your order within <strong>3–5 working days</strong>. We'll send you another email once it's on its way.</p>
      </div>
    `,
  });
};

// Sent to the admin when a new order is paid
const sendAdminOrderNotification = async (order) => {
  const itemLines = order.items
    .map((item) => `  ${item.name} x${item.quantity} — £${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  await transporter.sendMail({
    from: `Tea and Cake Productions <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_FROM,
    subject: `New order received — £${order.total.toFixed(2)}`,
    text: `New order from ${order.email}\n\n${itemLines}\n\nShipping: £${(order.shippingCost || 0).toFixed(2)}\nTotal: £${order.total.toFixed(2)}\n\nShip to:\n${formatAddress(order.shippingAddress)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto; color: #111;">
        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 12px;">New Order Received</h2>
        <p><strong>Customer:</strong> ${order.email}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          ${itemsTableHtml(order.items)}
          ${order.shippingCost ? `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #999;" colspan="2">Shipping</td>
            <td style="padding: 10px 0; text-align: right;">£${order.shippingCost.toFixed(2)}</td>
          </tr>` : ""}
        </table>
        <p style="text-align: right; font-weight: bold;">Total: £${order.total.toFixed(2)}</p>
        ${order.shippingAddress ? `
        <p style="margin-top: 24px;">
          <strong>Ship to:</strong><br>
          ${formatAddress(order.shippingAddress).split(", ").join("<br>")}
        </p>` : ""}
      </div>
    `,
  });
};

// Sent to the customer when the admin marks the order as shipped
const sendShippingNotification = async (email, order) => {
  await transporter.sendMail({
    from: `Tea and Cake Productions <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Your order is on its way — Tea and Cake Productions",
    text: `Great news! Your order has been shipped and is on its way to you.\n\nDelivering to: ${formatAddress(order.shippingAddress)}\n\nThank you for shopping with Tea and Cake Productions.`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto; color: #111;">
        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 12px;">Your Order Is On Its Way!</h2>
        <p>Great news — your order has been shipped and is on its way to you.</p>
        ${order.shippingAddress ? `
        <p style="margin-top: 24px;">
          <strong>Delivering to:</strong><br>
          ${formatAddress(order.shippingAddress).split(", ").join("<br>")}
        </p>` : ""}
        <p style="color: #666; font-size: 0.9rem; margin-top: 24px;">Thank you for shopping with Tea and Cake Productions.</p>
      </div>
    `,
  });
};

module.exports = { sendOrderConfirmation, sendAdminOrderNotification, sendShippingNotification };
