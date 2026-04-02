import * as React from 'react';

interface WelcomeEmailProps {
  email: string;
  brandName?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ email, brandName }) => (
  <html>
    <head>
      <style>
        {`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f9ff;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
          }
          .content {
            padding: 40px 30px;
          }
          .badge {
            display: inline-block;
            background-color: #ecfccb;
            color: #14532d;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-bottom: 20px;
          }
          h1 {
            color: #134e4a;
            font-size: 28px;
            margin: 0 0 16px 0;
            line-height: 1.3;
          }
          p {
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 16px 0;
          }
          .highlight {
            color: #134e4a;
            font-weight: 600;
          }
          .cta {
            background-color: #bef264;
            color: #134e4a;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 25px;
            display: inline-block;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
          }
        `}
      </style>
    </head>
    <body>
      <div style={{ padding: '40px 20px' }}>
        <div className="container">
          <div className="header">
            <img 
              src="https://your-domain.com/Pokecut_1775139303164.png" 
              alt="Ahid Logo" 
              className="logo"
            />
            <div className="badge">✨ Welcome to Ahid</div>
            <h1 style={{ color: '#134e4a', fontSize: '32px', margin: '10px 0' }}>
              You're on the list! 🥳
            </h1>
          </div>
          
          <div className="content">
            <p>Hi there!</p>
            
            <p>
              Thank you for joining the <span className="highlight">Ahid waitlist</span>. 
              We're thrilled to have you on board as we prepare to launch the platform that 
              connects you with trusted local brands.
            </p>
            
            {brandName && (
              <p>
                We noticed you're interested in <span className="highlight">{brandName}</span>. 
                We'll make sure to keep you updated on brands like this in your area!
              </p>
            )}
            
            <p>
              Here's what you can expect:
            </p>
            
            <ul style={{ color: '#4b5563', lineHeight: '1.8' }}>
              <li>Early access to the platform before public launch</li>
              <li>Exclusive insights into verified local brands</li>
              <li>Direct connection with authentic businesses in your community</li>
              <li>Special perks and discounts from our partner brands</li>
            </ul>
            
            <p>
              We'll notify you at <span className="highlight">{email}</span> as soon as we're ready to launch.
            </p>
            
            <div style={{ textAlign: 'center' }}>
              <a href="https://your-domain.com" className="cta">
                Visit Our Website
              </a>
            </div>
            
            <p style={{ marginTop: '30px' }}>
              In the meantime, follow us on social media to stay updated with the latest news!
            </p>
          </div>
          
          <div className="footer">
            <div className="social-links">
              <a href="#">Instagram</a> • 
              <a href="#">Facebook</a> • 
              <a href="#">YouTube</a>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              © 2026 Ahid. All rights reserved.
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>
              You received this email because you signed up for the Ahid waitlist.
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
);

export const generateWelcomeEmailHTML = (email: string, brandName?: string): string => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background-color: #f0f9ff;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
        padding: 40px 30px;
        text-align: center;
      }
      .logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        display: block;
      }
      .badge {
        display: inline-block;
        background-color: #ecfccb;
        color: #14532d;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        margin-bottom: 20px;
      }
      h1 {
        color: #134e4a;
        font-size: 28px;
        margin: 0 0 16px 0;
        line-height: 1.3;
      }
      p {
        color: #4b5563;
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 16px 0;
      }
      .highlight {
        color: #134e4a;
        font-weight: 600;
      }
      .cta {
        background-color: #bef264;
        color: #134e4a;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 25px;
        display: inline-block;
        font-weight: 600;
        margin: 20px 0;
      }
      .content {
        padding: 40px 30px;
      }
      .footer {
        background-color: #f9fafb;
        padding: 30px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      }
      ul {
        color: #4b5563;
        line-height: 1.8;
      }
    </style>
  </head>
  <body>
    <div style="padding: 40px 20px;">
      <div class="container">
        <div class="header">
          <div class="badge">✨ Welcome to Ahid</div>
          <h1 style="color: #134e4a; font-size: 32px; margin: 10px 0;">
            You're on the list! 🥳
          </h1>
        </div>
        
        <div class="content">
          <p>Hi there!</p>
          
          <p>
            Thank you for joining the <span class="highlight">Ahid waitlist</span>. 
            We're thrilled to have you on board as we prepare to launch the platform that 
            connects you with trusted local brands.
          </p>
          
          ${brandName ? `
          <p>
            We noticed you're interested in <span class="highlight">${brandName}</span>. 
            We'll make sure to keep you updated on brands like this in your area!
          </p>
          ` : ''}
          
          <p>
            Here's what you can expect:
          </p>
          
          <ul>
            <li>Early access to the platform before public launch</li>
            <li>Exclusive insights into verified local brands</li>
            <li>Direct connection with authentic businesses in your community</li>
            <li>Special perks and discounts from our partner brands</li>
          </ul>
          
          <p>
            We'll notify you at <span class="highlight">${email}</span> as soon as we're ready to launch.
          </p>
          
          <div style="text-align: center;">
            <a href="https://your-domain.com" class="cta">
              Visit Our Website
            </a>
          </div>
          
          <p style="margin-top: 30px;">
            In the meantime, follow us on social media to stay updated with the latest news!
          </p>
        </div>
        
        <div class="footer">
          <div style="margin: 20px 0;">
            <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Instagram</a> • 
            <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">Facebook</a> • 
            <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px;">YouTube</a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            © 2026 Ahid. All rights reserved.
          </p>
          <p style="font-size: 12px; color: #9ca3af;">
            You received this email because you signed up for the Ahid waitlist.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
  `.trim();
};
