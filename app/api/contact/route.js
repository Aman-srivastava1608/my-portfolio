import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const generateEmailTemplate = (name, email, phone, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Portfolio Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0; white-space: pre-wrap;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Reply directly to this email to respond to the sender.</p>
    </div>
  </div>
`;

async function sendEmail({ name, email, phone, message }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSKEY,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_ADDRESS}>`,
    to: process.env.EMAIL_ADDRESS,
    subject: `New Message From ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
    html: generateEmailTemplate(name, email, phone, message),
    replyTo: email,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, phone, message } = payload;

    if (!process.env.EMAIL_ADDRESS || !process.env.GMAIL_PASSKEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email service is not configured yet.',
        },
        { status: 500 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, email, and message are required.',
        },
        { status: 400 }
      );
    }

    await sendEmail({ name, email, phone, message });

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error.message);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send email. Check your email configuration.',
      },
      { status: 500 }
    );
  }
}
