import api from "@/lib/api"

export interface EmailConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
}

export interface PasswordResetRequest {
  email: string
  resetUrl: string
}

export interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent: string
}

class EmailService {
  private config: EmailConfig | null = null

  async initializeConfig(): Promise<void> {
    try {
      // In production, this would fetch from environment variables or secure config
      this.config = {
        smtpHost: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.VITE_SMTP_PORT || '587'),
        smtpUser: process.env.VITE_SMTP_USER || '',
        smtpPassword: process.env.VITE_SMTP_PASSWORD || '',
        fromEmail: process.env.VITE_FROM_EMAIL || 'noreply@urbanfarming.com',
        fromName: process.env.VITE_FROM_NAME || 'Urban Farming Management System'
      }
    } catch (error) {
      console.error('Failed to initialize email config:', error)
      throw new Error('Email service configuration failed')
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`
      
      const template = this.generatePasswordResetTemplate(resetUrl)
      
      // In a real application, this would call the backend API
      const response = await api.post('/api/auth/send-password-reset', {
        email,
        resetUrl,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent
      })

      return response.data.success
    } catch (error) {
      console.error('Failed to send password reset email:', error)
      return false
    }
  }

  async sendWelcomeEmail(email: string, username: string, tempPassword?: string): Promise<boolean> {
    try {
      const template = this.generateWelcomeTemplate(username, tempPassword)
      
      const response = await api.post('/api/auth/send-welcome-email', {
        email,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent
      })

      return response.data.success
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      return false
    }
  }

  async send2FACodeEmail(email: string, code: string): Promise<boolean> {
    try {
      const template = this.generate2FATemplate(code)
      
      const response = await api.post('/api/auth/send-2fa-code', {
        email,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent
      })

      return response.data.success
    } catch (error) {
      console.error('Failed to send 2FA code email:', error)
      return false
    }
  }

  private generatePasswordResetTemplate(resetUrl: string): EmailTemplate {
    const subject = 'Reset Your Urban Farming Management System Password'
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #72B01D; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #72B01D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Urban Farming Management System</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>You have requested to reset your password for the Urban Farming Management System.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
              <p>If you didn't request this password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 Urban Farming Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
    
    const textContent = `
      Urban Farming Management System - Password Reset
      
      You have requested to reset your password for the Urban Farming Management System.
      
      Please visit the following link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email.
      
      © 2024 Urban Farming Management System. All rights reserved.
    `
    
    return { subject, htmlContent, textContent }
  }

  private generateWelcomeTemplate(username: string, tempPassword?: string): EmailTemplate {
    const subject = 'Welcome to Urban Farming Management System'
    
    const passwordSection = tempPassword 
      ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p><p>Please change this password after your first login.</p>`
      : '<p>Please use the password you created during registration.</p>'
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #72B01D; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #72B01D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Urban Farming Management System</h1>
            </div>
            <div class="content">
              <h2>Hello ${username}!</h2>
              <p>Welcome to the Urban Farming Management System. Your account has been successfully created.</p>
              ${passwordSection}
              <p>You can now access your dashboard and start managing your urban farming operations.</p>
              <a href="${window.location.origin}/login" class="button">Login to Dashboard</a>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 Urban Farming Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
    
    const textContent = `
      Welcome to Urban Farming Management System
      
      Hello ${username}!
      
      Welcome to the Urban Farming Management System. Your account has been successfully created.
      
      ${tempPassword ? `Temporary Password: ${tempPassword}\nPlease change this password after your first login.` : 'Please use the password you created during registration.'}
      
      You can now access your dashboard and start managing your urban farming operations.
      
      Login at: ${window.location.origin}/login
      
      If you have any questions, please don't hesitate to contact our support team.
      
      © 2024 Urban Farming Management System. All rights reserved.
    `
    
    return { subject, htmlContent, textContent }
  }

  private generate2FATemplate(code: string): EmailTemplate {
    const subject = 'Your Two-Factor Authentication Code'
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>2FA Code</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #72B01D; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; text-align: center; }
            .code { font-size: 32px; font-weight: bold; color: #72B01D; letter-spacing: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Two-Factor Authentication</h1>
            </div>
            <div class="content">
              <h2>Your Verification Code</h2>
              <p>Enter this code in your authenticator app or login form:</p>
              <div class="code">${code}</div>
              <p><strong>This code will expire in 5 minutes.</strong></p>
              <p>If you didn't request this code, please contact support immediately.</p>
            </div>
            <div class="footer">
              <p>© 2024 Urban Farming Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
    
    const textContent = `
      Urban Farming Management System - Two-Factor Authentication
      
      Your Verification Code: ${code}
      
      Enter this code in your authenticator app or login form.
      
      This code will expire in 5 minutes.
      
      If you didn't request this code, please contact support immediately.
      
      © 2024 Urban Farming Management System. All rights reserved.
    `
    
    return { subject, htmlContent, textContent }
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      const response = await api.get('/api/auth/test-email-connection')
      return response.data.success
    } catch (error) {
      console.error('Email connection test failed:', error)
      return false
    }
  }
}

export const emailService = new EmailService()
