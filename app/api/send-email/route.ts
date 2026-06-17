import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    const from = process.env.SMTP_FROM || 'no-reply@immo360.africa';

    // 1. Check for Resend API Key
    if (process.env.RESEND_API_KEY) {
      console.info("Sending email using Resend HTTP API...");
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `"IMMO360 AFRIQUE" <${from}>`,
            to: [to],
            subject,
            html,
          }),
        });

        if (response.ok) {
          return NextResponse.json({ success: true });
        } else {
          const errData = await response.json();
          console.error("Resend API returned an error:", errData);
          throw new Error(errData.message || "Resend API error");
        }
      } catch (err: any) {
        console.error("Failed to send email via Resend API:", err);
        return NextResponse.json({ success: false, error: `Resend error: ${err.message}` }, { status: 500 });
      }
    }

    // 2. Check for Brevo API Key
    if (process.env.BREVO_API_KEY) {
      console.info("Sending email using Brevo HTTP API...");
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: { email: from, name: 'IMMO360 AFRIQUE' },
            to: [{ email: to }],
            subject,
            htmlContent: html,
          }),
        });

        if (response.ok) {
          return NextResponse.json({ success: true });
        } else {
          const errData = await response.json();
          console.error("Brevo API returned an error:", errData);
          throw new Error(JSON.stringify(errData));
        }
      } catch (err: any) {
        console.error("Failed to send email via Brevo API:", err);
        return NextResponse.json({ success: false, error: `Brevo error: ${err.message}` }, { status: 500 });
      }
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // 3. Ethereal fallback (if SMTP credentials are not configured)
    if (!host || !user || !pass) {
      console.info("SMTP credentials not configured in .env. Using Ethereal Email fallback.");
      try {
        // Create a test account dynamically on Ethereal
        const testAccount = await nodemailer.createTestAccount();
        
        const testTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const info = await testTransporter.sendMail({
          from: '"IMMO360 AFRIQUE" <no-reply@immo360.africa>',
          to,
          subject,
          html,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log("E-mail validation sent via Ethereal. Preview URL: %s", previewUrl);

        return NextResponse.json({ 
          success: true, 
          isTest: true, 
          previewUrl 
        });
      } catch (testAccountError: any) {
        console.warn("Failed to send via Ethereal (probably offline or rate limited). Falling back to local/demo display mode.", testAccountError);
        return NextResponse.json({
          success: true,
          isTest: true,
          isLocalFallback: true
        });
      }
    }

    // 4. Custom SMTP transport (if credentials are set)
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || '587'),
      secure: port === '465',
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false
      }
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

