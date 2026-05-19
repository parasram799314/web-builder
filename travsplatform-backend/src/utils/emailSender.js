require("dotenv").config();
const path = require("path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const nodemailer = require("nodemailer");
const juice = require("juice");

// Initialize Babel to support JSX on the fly
require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
  extensions: [".jsx", ".js"],
  only: [/new-frontend/, /travsplatform-backend/],
});

// Create a reusable transporter instance
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Helps with some network/firewall issues
  }
});

/**
 * Main function to render a React component and send it as an email
 */
async function sendReactEmail(to, subject, componentPath, props = {}) {
  try {
    const absolutePath = path.resolve(__dirname, componentPath);
    
    // Cache management: only delete in dev or when needed
    delete require.cache[absolutePath]; 
    
    const Component = require(absolutePath).default;
    const rawHtml = renderToStaticMarkup(React.createElement(Component, props));
    const inlinedHtml = juice(rawHtml);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"${process.env.EMAIL_FROM_NAME || 'Travel Agency'}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: inlinedHtml,
    });

    console.log("✅ Fast Email sent!");
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email Failed:", error.message);
    throw error;
  }
}

module.exports = { sendReactEmail };
