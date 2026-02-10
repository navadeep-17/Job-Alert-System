import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  try {
    await resend.emails.send({
      from: 'JobAlert <onboarding@resend.dev>', // Resend test domain (for development only)
      to: email,
      subject: 'Verify Your JobAlert Subscription',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">JobAlert</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937;">Verify Your Email Address</h2>
              
              <p>Thank you for subscribing to JobAlert! We're excited to help you find your dream job.</p>
              
              <p>Please click the button below to verify your email address and activate your subscription:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #6b7280; font-size: 12px;">
                If you didn't subscribe to JobAlert, you can safely ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendJobAlertEmail(
  email: string, 
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    category: string;
    salary?: string | null;
    type: string;
  }>,
  unsubscribeUrl: string
) {
  const jobsHtml = jobs.map(job => `
    <div style="background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h3 style="margin: 0 0 10px 0; color: #2563eb;">
        <a href="${process.env.APP_URL}/jobs/${job.id}" style="color: #2563eb; text-decoration: none;">
          ${job.title}
        </a>
      </h3>
      <p style="margin: 5px 0; color: #1f2937; font-weight: bold;">${job.company}</p>
      <div style="margin: 10px 0;">
        <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 13px; margin-right: 8px;">
          ${job.category}
        </span>
        <span style="background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 12px; font-size: 13px; margin-right: 8px;">
          ${job.location}
        </span>
        <span style="background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 12px; font-size: 13px;">
          ${job.type}
        </span>
      </div>
      ${job.salary ? `<p style="margin: 10px 0; color: #059669; font-weight: bold;">${job.salary}</p>` : ''}
      <a href="${process.env.APP_URL}/jobs/${job.id}" 
         style="display: inline-block; margin-top: 10px; color: #2563eb; text-decoration: none; font-weight: 500;">
        View Details →
      </a>
    </div>
  `).join('');

  try {
    await resend.emails.send({
      from: 'JobAlert <onboarding@resend.dev>', // Resend test domain (for development only)
      to: email,
      subject: `${jobs.length} New Job${jobs.length > 1 ? 's' : ''} Matching Your Preferences`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
            <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">JobAlert</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">New Jobs for You! 🎯</h2>
              
              <p>We found ${jobs.length} new job${jobs.length > 1 ? 's' : ''} matching your preferences:</p>
              
              ${jobsHtml}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.APP_URL}/jobs" 
                   style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Browse All Jobs
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #6b7280; font-size: 12px; text-align: center;">
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">
                  Unsubscribe from job alerts
                </a>
              </p>
            </div>
          </body>
        </html>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}
