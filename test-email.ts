import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log(`User: ${process.env.EMAIL_USER}`);
  console.log(`Host: ${process.env.EMAIL_HOST}`);
  console.log(`Port: ${process.env.EMAIL_PORT}`);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"VibePass Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self to test
      subject: "VibePass Email Test",
      text: "If you receive this, your email configuration is working!",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Email configuration is VALID.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();
