import type { APIRoute } from "astro";
import { Resend } from "resend";
import siteData from "../../data.json";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { company } = siteData;

    // Email to admin
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            color: #334155;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .header {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          .tagline {
            font-size: 16px;
            margin: 0;
            opacity: 0.9;
            font-weight: 400;
          }
          .content {
            padding: 40px 30px;
          }
          .title {
            color: #1e293b;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 24px;
            text-align: center;
          }
          .submission-card {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            border-left: 5px solid #ff9800;
          }
          .field-group {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #475569;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            display: block;
          }
          .value {
            color: #1e293b;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 0;
          }
          .message-container {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-top: 12px;
            white-space: pre-wrap;
            line-height: 1.7;
            color: #374151;
          }
          .metadata {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
          }
          .metadata-text {
            color: #64748b;
            font-size: 14px;
            margin: 0;
          }
          .footer {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px;
            text-align: center;
            border-top: 3px solid #ff9800;
          }
          .footer-logo {
            color: #ff9800;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          .footer-text {
            color: #475569;
            font-size: 14px;
            margin: 8px 0;
          }
          .exploration-section {
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            border-left: 5px solid #ff9800;
            text-align: center;
          }
          .exploration-title {
            color: #ea580c;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .exploration-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-top: 15px;
          }
          .exploration-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff9800;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .exploration-link:hover {
            background-color: #f57c00;
            transform: translateY(-2px);
          }
          .highlight {
            color: #ff9800;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">InPlace Creates</div>
            <p class="tagline">Where Ideas Take Shape</p>
          </div>
          
          <div class="content">
            <h1 class="title">📬 New Contact Submission</h1>
            
            <div class="submission-card">
              <div class="field-group">
                <span class="label">Contact Name</span>
                <p class="value">${name}</p>
              </div>
              
              <div class="field-group">
                <span class="label">Email Address</span>
                <p class="value">${email}</p>
              </div>
              
              <div class="field-group">
                <span class="label">Message</span>
                <div class="message-container">${message}</div>
              </div>
            </div>
            
            <div class="metadata">
              <p class="metadata-text">
                <strong>Received:</strong> ${new Date().toLocaleString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  }
                )}
              </p>
            </div>

            <div class="exploration-section">
              <div class="exploration-title">🚀 Quick Access Links</div>
              <p style="color: #92400e; font-size: 14px; margin: 10px 0;">Explore our latest content and services</p>
              <div class="exploration-links">
                <a href="https://${
                  company.url
                }/services" class="exploration-link">Our Services</a>
                <a href="https://${
                  company.url
                }/portfolio" class="exploration-link">Portfolio</a>
                <a href="https://${
                  company.url
                }/blog" class="exploration-link">Latest Blog</a>
                <a href="https://${
                  company.url
                }/team" class="exploration-link">Meet the Team</a>
              </div>
            </div>

            <div class="exploration-section">
              <div class="exploration-title">🚀 Quick Access Links</div>
              <p style="color: #92400e; font-size: 14px; margin: 10px 0;">Explore our latest content and services</p>
              <div class="exploration-links">
                <a href="https://${
                  company.url
                }/services" class="exploration-link">Our Services</a>
                <a href="https://${
                  company.url
                }/portfolio" class="exploration-link">Portfolio</a>
                <a href="https://${
                  company.url
                }/blog" class="exploration-link">Latest Blog</a>
                <a href="https://${
                  company.url
                }/team" class="exploration-link">Meet the Team</a>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-logo">InPlace Creates</div>
            <p class="footer-text">${company.contact.location}</p>
            <p class="footer-text">${company.contact.email} | ${
      company.contact.phone
    }</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Auto-reply email to sender
    const autoReplyHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting InPlace Creates</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            color: #334155;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .header {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          .tagline {
            font-size: 16px;
            margin: 0;
            opacity: 0.9;
            font-weight: 400;
          }
          .content {
            padding: 40px 30px;
          }
          .title {
            color: #1e293b;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 24px;
            text-align: center;
          }
          .welcome-text {
            color: #475569;
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 24px;
            text-align: center;
          }
          .highlight-box {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
            color: #ffffff;
            padding: 30px 25px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
            box-shadow: 0 8px 25px rgba(255, 152, 0, 0.2);
          }
          .highlight-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -0.3px;
          }
          .highlight-text {
            font-size: 15px;
            margin: 0;
            opacity: 0.95;
            line-height: 1.6;
          }
          .services-section {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 12px;
            padding: 30px 25px;
            margin: 30px 0;
            border-left: 5px solid #ff9800;
          }
          .services-title {
            color: #1e293b;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
          }
          .services-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 20px;
          }
          .service-item {
            background-color: #ffffff;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            transition: all 0.3s ease;
          }
          .service-emoji {
            font-size: 24px;
            margin-bottom: 8px;
            display: block;
          }
          .service-name {
            color: #374151;
            font-size: 14px;
            font-weight: 600;
            margin: 0;
          }
          .contact-info {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
          }
          .contact-title {
            font-weight: 600;
            color: #1e293b;
            font-size: 18px;
            margin-bottom: 16px;
          }
          .contact-item {
            color: #475569;
            margin-bottom: 10px;
            font-size: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .footer {
            background-color: #1e293b;
            padding: 30px;
            text-align: center;
          }
          .footer-logo {
            color: #ff9800;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          .footer-text {
            color: #94a3b8;
            font-size: 14px;
            margin: 8px 0;
          }
          .social-links {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 20px;
          }
          .social-link {
            color: #ff9800;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 20px;
            background-color: rgba(255, 152, 0, 0.1);
            transition: all 0.3s ease;
          }
          .social-link:hover {
            background-color: #ff9800;
            color: white;
          }
          .signature {
            color: #475569;
            font-size: 16px;
            margin-top: 30px;
            text-align: center;
          }
          .team-name {
            color: #ff9800;
            font-weight: 700;
            font-size: 17px;
          }
          @media (max-width: 600px) {
            .services-grid {
              grid-template-columns: 1fr;
            }
            .social-links {
              flex-direction: column;
              gap: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">InPlace Creates</div>
            <p class="tagline">Where Ideas Take Shape</p>
          </div>
          
          <div class="content">
            <h1 class="title">Thank you, ${name}! 🎉</h1>
            
            <p class="welcome-text">
              We've received your message and truly appreciate you taking the time to reach out. 
              Your inquiry is important to us, and our creative team is already excited about the possibility of working together!
            </p>
            
            <div class="highlight-box">
              <div class="highlight-title">What happens next?</div>
              <p class="highlight-text">
                Our team will carefully review your project details and respond within 24-48 hours with next steps. 
                We can't wait to potentially bring your vision to life!
              </p>
            </div>

            <div class="services-section">
              <div class="services-title">🎨 Explore Our Creative Services</div>
              <p style="color: #64748b; text-align: center; margin-bottom: 20px; font-size: 15px;">While you wait, discover what we can create together</p>
              <div class="services-grid">
                <div class="service-item">
                  <span class="service-emoji">🎯</span>
                  <p class="service-name">Branding & Identity</p>
                </div>
                <div class="service-item">
                  <span class="service-emoji">📱</span>
                  <p class="service-name">Digital Experiences</p>
                </div>
                <div class="service-item">
                  <span class="service-emoji">📸</span>
                  <p class="service-name">Campaigns & Media</p>
                </div>
                <div class="service-item">
                  <span class="service-emoji">⚡</span>
                  <p class="service-name">Creative Systems</p>
                </div>
              </div>
            </div>
            
            <div class="contact-info">
              <div class="contact-title">📞 Get in touch anytime</div>
              <div class="contact-item">📧 ${company.contact.email}</div>
              <div class="contact-item">📱 ${company.contact.phone}</div>
              <div class="contact-item">📍 ${company.contact.location}</div>
            </div>
            
            <div class="signature">
              <strong>Best regards,</strong><br>
              <span class="team-name">The InPlace Creates Team</span>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-logo">InPlace Creates</div>
            <p class="footer-text">${company.contact.location} | ${company.contact.email}</p>
            
            <div class="social-links">
              <a href="${company.socialMedia.instagram}" class="social-link">Instagram</a>
              <a href="${company.socialMedia.linkedin}" class="social-link">LinkedIn</a>
              <a href="https://${company.url}" class="social-link">Website</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send admin notification email
    const adminEmail = await resend.emails.send({
      from: `${company.name} Contact Form <noreply@${company.url}>`,
      to: ["connect@inplacecreates.com"],
      subject: `New Contact Form Submission from ${name}`,
      html: adminEmailHTML,
      replyTo: email,
    });

    // Send auto-reply to user
    const autoReply = await resend.emails.send({
      from: `${company.name} <noreply@${company.url}>`,
      to: [email],
      subject: `Thank you for contacting ${company.name}!`,
      html: autoReplyHTML,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Your message has been sent successfully! We'll get back to you soon.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return new Response(
      JSON.stringify({
        error:
          "Failed to send message. Please try again later or contact us directly.",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
