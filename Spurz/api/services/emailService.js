const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

const sendVerificationEmail = async (email, fullName, verificationToken) => {
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: `"Spurz Marketplace" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '🚀 Welcome to Spurz! Please verify your email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Spurz</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .welcome-message { 
            font-size: 18px; 
            color: #2c3e50; 
            margin-bottom: 20px; 
          }
          .verify-button { 
            display: inline-block; 
            background: #FFA500; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px;
            margin: 20px 0;
            transition: background 0.3s;
          }
          .verify-button:hover { 
            background: #FF8C00; 
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px 30px; 
            text-align: center; 
            font-size: 14px; 
            color: #6c757d; 
          }
          .security-note { 
            background: #e8f4f8; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 20px 0; 
            font-size: 14px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to Spurz!</h1>
          </div>
          <div class="content">
            <p class="welcome-message">Hi ${fullName}!</p>
            <p>Thank you for joining Spurz Marketplace! We're excited to have you as part of our community where you can buy and sell without leaving your spot.</p>
            
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="verify-button">
                ✅ Verify My Email
              </a>
            </div>
            
            <div class="security-note">
              <strong>🔒 Security Note:</strong> This verification link will expire in 24 hours for your security. If you didn't create this account, please ignore this email.
            </div>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>🛍️ Browse and purchase products from local vendors</li>
              <li>💬 Chat with sellers directly</li>
              <li>⭐ Leave reviews and ratings</li>
              <li>📦 Track your orders in real-time</li>
            </ul>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #FFA500;">${verificationUrl}</p>
          </div>
          <div class="footer">
            <p>© 2025 Spurz Marketplace. All rights reserved.</p>
            <p>This email was sent to ${email}. If you didn't sign up for Spurz, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email, fullName) => {
  const mailOptions = {
    from: `"Spurz Marketplace" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '🎉 Welcome to Spurz! Your account is now active',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; }
          .header { background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 40px 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Verified!</h1>
          </div>
          <div class="content">
            <p>Hi ${fullName}!</p>
            <p>Congratulations! Your Spurz account has been successfully verified and is now active.</p>
            <p>You can now enjoy all the features of our marketplace:</p>
            <ul>
              <li>🛍️ Shop from local vendors</li>
              <li>💬 Direct messaging with sellers</li>
              <li>⭐ Rate and review products</li>
              <li>📦 Track your orders</li>
            </ul>
            <p>Happy shopping!</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail
};
