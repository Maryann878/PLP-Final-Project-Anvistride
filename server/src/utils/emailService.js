// server/src/utils/emailService.js
import { Resend } from 'resend';

let resend;
let isEmailServiceConfigured = false;

// Initialize Resend only if API key is provided
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
    isEmailServiceConfigured = true;
  }
} catch (error) {
  console.warn('⚠️ Resend initialization error:', error.message);
}

/**
 * Send email verification email
 * @param {string} email - User's email address
 * @param {string} token - Verification token
 * @param {string} username - User's name (optional)
 */
export const sendVerificationEmail = async (email, token, username = 'User') => {
  // ✅ Graceful degradation: Don't fail if Resend isn't configured
  if (!isEmailServiceConfigured || !resend) {
    console.warn('⚠️ Email service not configured - skipping email send');
    // In development, log the token for testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 [DEV] Verification token for ${email}: ${token}`);
      console.log(`📧 [DEV] Verification URL: ${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`);
    }
    return { success: false, reason: 'Email service not configured' };
  }

  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Verify your email address - Anvistride',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to Anvistride!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Hi ${username},</h2>
            <p>Thank you for signing up! Please verify your email address to complete your registration and start your journey.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block; 
                        font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #667eea; word-break: break-all; font-size: 12px; background: #f0f0f0; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Note:</strong> This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Anvistride. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Anvistride!
        
        Hi ${username},
        
        Thank you for signing up! Please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This verification link will expire in 24 hours.
        
        If you didn't create an account, you can safely ignore this email.
        
        © ${new Date().getFullYear()} Anvistride. All rights reserved.
      `,
    });

    console.log('✅ Verification email sent successfully to:', email);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    // ✅ Don't throw - allow registration to continue even if email fails
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} token - Reset token
 * @param {string} username - User's name (optional)
 */
export const sendPasswordResetEmail = async (email, token, username = 'User') => {
  if (!isEmailServiceConfigured || !resend) {
    console.warn('⚠️ Email service not configured - skipping password reset email');
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 [DEV] Password reset token for ${email}: ${token}`);
    }
    return { success: false, reason: 'Email service not configured' };
  }

  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Reset your password - Anvistride',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Password Reset Request</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Hi ${username},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block; 
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #667eea; word-break: break-all; font-size: 12px; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Note:</strong> This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Anvistride. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Password reset email sent successfully to:', email);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if email service is configured
 */
export const isEmailConfigured = () => isEmailServiceConfigured;

