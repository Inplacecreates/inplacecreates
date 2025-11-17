import type { APIRoute } from "astro";
import { Resend } from "resend";
import siteData from "../../data.json";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const firstName = (formData.get("firstName") as string) || "";

    // Validation
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email address is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Trim whitespace and validate
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { company } = siteData;

    // Add subscriber to audience using contacts API
    const audienceResult = await resend.contacts.create({
      audienceId: import.meta.env.RESEND_AUDIENCE_ID,
      email: trimmedEmail,
      firstName: firstName || undefined,
      unsubscribed: false,
    });

    // Check if audience subscription was successful
    if (audienceResult.error) {
      throw new Error(
        audienceResult.error.message || "Failed to add to audience"
      );
    }

    // Send welcome email
    const welcomeEmailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to InPlace Creates Newsletter!</title>
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
            padding: 50px 30px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
            animation: float 20s infinite linear;
          }
          .logo {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 12px;
            letter-spacing: -0.8px;
            position: relative;
            z-index: 2;
          }
          .tagline {
            font-size: 18px;
            margin: 0;
            opacity: 0.95;
            font-weight: 400;
            position: relative;
            z-index: 2;
          }
          .welcome-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 20px;
            display: inline-block;
            position: relative;
            z-index: 2;
          }
          .content {
            padding: 50px 30px;
          }
          .title {
            color: #1e293b;
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 24px;
            text-align: center;
            line-height: 1.2;
          }
          .welcome-text {
            color: #475569;
            font-size: 18px;
            line-height: 1.7;
            margin-bottom: 30px;
            text-align: center;
          }
          .benefits-section {
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border-radius: 16px;
            padding: 35px 30px;
            margin: 40px 0;
            border-left: 6px solid #ff9800;
          }
          .benefits-title {
            color: #ea580c;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 25px;
            text-align: center;
          }
          .benefits-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 25px;
          }
          .benefit-item {
            background-color: rgba(255, 255, 255, 0.8);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }
          .benefit-emoji {
            font-size: 28px;
            margin-bottom: 12px;
            display: block;
          }
          .benefit-title {
            color: #1e293b;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .benefit-text {
            color: #64748b;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
          }
          .cta-section {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 16px;
            padding: 35px 30px;
            margin: 40px 0;
            text-align: center;
            border: 2px solid #ff9800;
          }
          .cta-title {
            color: #1e293b;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 16px;
          }
          .cta-text {
            color: #475569;
            font-size: 16px;
            margin-bottom: 25px;
            line-height: 1.6;
          }
          .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
          }
          .cta-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #ff9800;
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
          }
          .cta-button:hover {
            background-color: #f57c00;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
          }
          .cta-button-secondary {
            background-color: transparent;
            color: #ff9800;
            border: 2px solid #ff9800;
            box-shadow: none;
          }
          .cta-button-secondary:hover {
            background-color: #ff9800;
            color: white;
          }
          .social-section {
            text-align: center;
            margin: 40px 0;
          }
          .social-title {
            color: #1e293b;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
          }
          .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
          }
          .social-link {
            display: inline-block;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
            border-radius: 50%;
            text-decoration: none;
            color: white;
            font-size: 20px;
            line-height: 50px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);
          }
          .social-link:hover {
            transform: translateY(-3px) scale(1.1);
            box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
          }
          .footer {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 40px 30px;
            text-align: center;
            border-top: 3px solid #ff9800;
          }
          .footer-logo {
            color: #ff9800;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
          }
          .footer-text {
            color: #475569;
            font-size: 14px;
            margin: 8px 0;
          }
          .unsubscribe {
            color: #94a3b8;
            font-size: 12px;
            margin-top: 20px;
          }
          .unsubscribe a {
            color: #ff9800;
            text-decoration: none;
          }
          @keyframes float {
            0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
            33% { transform: translateX(30px) translateY(-30px) rotate(120deg); }
            66% { transform: translateX(-20px) translateY(20px) rotate(240deg); }
            100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
          }
          @media (max-width: 600px) {
            .benefits-grid {
              grid-template-columns: 1fr;
            }
            .cta-buttons {
              flex-direction: column;
              gap: 10px;
            }
            .social-links {
              flex-wrap: wrap;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">InPlace Creates</div>
            <p class="tagline">Where Ideas Take Shape</p>
            <div class="welcome-badge">🎉 Welcome to our community!</div>
          </div>
          
          <div class="content">
            <h1 class="title">Welcome${
              firstName ? `, ${firstName}` : ""
            }! ✨</h1>
            
            <p class="welcome-text">
              Thank you for joining the InPlace Creates community! You're now part of a creative family that's passionate about bringing ideas to life through innovative design, storytelling, and digital experiences.
            </p>

            <div class="benefits-section">
              <div class="benefits-title">📬 What you'll receive</div>
              <div class="benefits-grid">
                <div class="benefit-item">
                  <span class="benefit-emoji">🎨</span>
                  <div class="benefit-title">Design Insights</div>
                  <p class="benefit-text">Behind-the-scenes looks at our creative process and design trends</p>
                </div>
                <div class="benefit-item">
                  <span class="benefit-emoji">💡</span>
                  <div class="benefit-title">Creative Tips</div>
                  <p class="benefit-text">Practical advice for branding, web design, and digital strategy</p>
                </div>
                <div class="benefit-item">
                  <span class="benefit-emoji">🚀</span>
                  <div class="benefit-title">Latest Projects</div>
                  <p class="benefit-text">First looks at our newest work and client success stories</p>
                </div>
                <div class="benefit-item">
                  <span class="benefit-emoji">🎯</span>
                  <div class="benefit-title">Exclusive Content</div>
                  <p class="benefit-text">Subscriber-only resources, templates, and special offers</p>
                </div>
              </div>
            </div>

            <div class="cta-section">
              <div class="cta-title">🌟 Explore Our World</div>
              <p class="cta-text">While you're here, discover what we do and how we can help bring your vision to life.</p>
              <div class="cta-buttons">
                <a href="https://${
                  company.url
                }/services" class="cta-button">Our Services</a>
                <a href="https://${
                  company.url
                }/portfolio" class="cta-button-secondary">View Portfolio</a>
                <a href="https://${
                  company.url
                }/blog" class="cta-button-secondary">Read Our Blog</a>
              </div>
            </div>

            <div class="social-section">
              <div class="social-title">🤝 Let's connect on social media</div>
              <div class="social-links">
                <a href="${
                  company.socialMedia.instagram
                }" class="social-link">📸</a>
                <a href="${
                  company.socialMedia.linkedin
                }" class="social-link">💼</a>
                <a href="https://${company.url}" class="social-link">🌐</a>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-logo">InPlace Creates</div>
            <p class="footer-text">${company.contact.location}</p>
            <p class="footer-text">${company.contact.email} | ${
      company.contact.phone
    }</p>
            
            <p class="unsubscribe">
              You're receiving this because you subscribed to our newsletter.<br>
              <a href="#">Unsubscribe</a> | <a href="#">Update preferences</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send welcome email
    const welcomeEmail = await resend.emails.send({
      from: `${company.name} <noreply@${company.url}>`,
      to: [trimmedEmail],
      subject: `🎉 Welcome to ${company.name} - Your creative journey starts here!`,
      html: welcomeEmailHTML,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Successfully subscribed! Check your email for a welcome message.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    // Handle duplicate subscriber error
    if (error instanceof Error && error.message.includes("already exists")) {
      return new Response(
        JSON.stringify({
          error: "You are already subscribed to our newsletter.",
          duplicate: true,
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Failed to subscribe. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
