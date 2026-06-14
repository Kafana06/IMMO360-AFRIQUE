import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'no-reply@immo360.africa';

    if (!host || !user || !pass) {
      console.warn("SMTP credentials not configured in .env. Fallback to mock toast.");
      return NextResponse.json({ success: false, error: 'SMTP_NOT_CONFIGURED' });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || '587'),
      secure: port === '465',
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"IMMO360 AFRIQUE" <${from}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
