/**
 * Rich, responsive HTML email templates for RAMA INTERNATIONAL-INDIA transactions.
 * Designed with a premium navy (#051B3D) and gold (#D4AF37) brand aesthetic.
 */

const baseHeader = `
  <div style="background-color: #051B3D; padding: 25px; text-align: center; border-radius: 6px 6px 0 0;">
    <h1 style="color: #D4AF37; font-family: 'Cinzel', serif; margin: 0; font-size: 24px; letter-spacing: 2px;">RAMA INTERNATIONAL</h1>
    <p style="color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Global Recruitment Partner</p>
  </div>
`;

const baseFooter = `
  <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 11px; color: #718096; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <p style="margin: 0 0 5px 0;"><strong>RAMA INTERNATIONAL-INDIA</strong></p>
    <p style="margin: 0 0 5px 0;">MEA License: RC-B-0850/DEL/COM/1000+/5/9385/2018</p>
    <p style="margin: 0;">This is an automated operational notification. Please do not reply directly to this email.</p>
  </div>
`;

function wrapLayout(content: string): string {
  return `
    <div style="background-color: #f7fafc; padding: 30px 15px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #edf2f7;">
        ${baseHeader}
        <div style="padding: 30px; line-height: 1.6; color: #2d3748; font-size: 14px;">
          ${content}
          ${baseFooter}
        </div>
      </div>
    </div>
  `;
}

export function getRegistrationTemplate(fullName: string, role: string, verificationLink: string): string {
  return wrapLayout(`
    <h2 style="color: #051B3D; font-size: 18px; margin-top: 0;">Welcome to RAMA INTERNATIONAL, ${fullName}!</h2>
    <p>Thank you for registering on our global recruitment platform. Your account is registered with the role of <strong>${role}</strong>.</p>
    <p>To finalize your setup and begin browsing live drives or managing candidates, please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="${verificationLink}" style="background-color: #D4AF37; color: #051B3D; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 4px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Verify Email Address</a>
    </div>
    <p style="font-size: 12px; color: #718096;">If the button above does not work, copy and paste this URL into your browser:<br/>
    <a href="${verificationLink}" style="color: #D4AF37;">${verificationLink}</a></p>
  `);
}

export function getPasswordResetTemplate(fullName: string, resetLink: string): string {
  return wrapLayout(`
    <h2 style="color: #051B3D; font-size: 18px; margin-top: 0;">Password Reset Request</h2>
    <p>Hello ${fullName},</p>
    <p>We received a request to reset the password associated with your account. Click the button below to configure a new password:</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="${resetLink}" style="background-color: #051B3D; color: #D4AF37; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 4px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Reset Password</a>
    </div>
    <p>This recovery link is active for <strong>1 hour</strong>. If you did not initiate this request, you can safely ignore this email.</p>
    <p style="font-size: 12px; color: #718096;">Link:<br/><a href="${resetLink}" style="color: #D4AF37;">${resetLink}</a></p>
  `);
}

export function getApplicationSubmittedTemplate(candidateName: string, jobTitle: string, country: string): string {
  return wrapLayout(`
    <h2 style="color: #051B3D; font-size: 18px; margin-top: 0;">Application Confirmed</h2>
    <p>Dear ${candidateName},</p>
    <p>We are pleased to confirm that we have successfully received your dossier for the following opening:</p>
    <div style="background-color: #f7fafc; padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin: 0 0 5px 0;"><strong>Job Role:</strong> ${jobTitle}</p>
      <p style="margin: 0;"><strong>Country:</strong> ${country}</p>
    </div>
    <p>Our team of expert technical recruiters is currently reviewing your profile against our partner's criteria. You can track your application status live on the Candidate Dashboard stepper.</p>
    <p>Best of luck with your application!</p>
  `);
}

export function getApplicationApprovedTemplate(candidateName: string, jobTitle: string, notes?: string): string {
  return wrapLayout(`
    <h2 style="color: #00875A; font-size: 18px; margin-top: 0;">Congratulations! Application Shortlisted</h2>
    <p>Dear ${candidateName},</p>
    <p>We have exciting news! Your application for the position of <strong>"${jobTitle}"</strong> has been approved for the next stage.</p>
    ${notes ? `<div style="background-color: #f7fafc; padding: 15px; border-left: 4px solid #00875A; margin: 20px 0;"><p style="margin:0;"><strong>Recruiter Notes:</strong> ${notes}</p></div>` : ""}
    <p>A coordinator from our mobilize team will reach out to you shortly regarding the next steps (biometrics, medicals, or trade test arrangements).</p>
    <p>Please check your Candidate Dashboard for schedule updates.</p>
  `);
}

export function getApplicationRejectedTemplate(candidateName: string, jobTitle: string): string {
  return wrapLayout(`
    <h2 style="color: #DE350B; font-size: 18px; margin-top: 0;">Application Status Update</h2>
    <p>Dear ${candidateName},</p>
    <p>Thank you for your interest in the <strong>"${jobTitle}"</strong> position. After reviewing your qualifications against the specific requirements of our client, we regret to inform you that we will not be moving forward with your candidacy for this particular vacancy.</p>
    <p>We will keep your resume in our global database and contact you immediately if other matching international drives open.</p>
    <p>Thank you again for choosing RAMA INTERNATIONAL.</p>
  `);
}

export function getEmployerNotificationTemplate(companyName: string, candidateName: string, jobTitle: string, candidateProfileLink: string): string {
  return wrapLayout(`
    <h2 style="color: #051B3D; font-size: 18px; margin-top: 0;">New Applicant Alert</h2>
    <p>Hello ${companyName} Hiring Team,</p>
    <p>A new applicant has applied to your job listing: <strong>"${jobTitle}"</strong>.</p>
    <div style="background-color: #f7fafc; padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin:0;"><strong>Candidate:</strong> ${candidateName}</p>
    </div>
    <p>Log in to your Employer Dashboard to review their qualifications, download documents, and schedule interviews.</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="${candidateProfileLink}" style="background-color: #051B3D; color: #D4AF37; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 4px; display: inline-block;">Review Applicant</a>
    </div>
  `);
}

export function getContactFormTemplate(name: string, email: string, message: string, phone?: string, companyName?: string): string {
  return wrapLayout(`
    <h2 style="color: #051B3D; font-size: 18px; margin-top: 0;">New Contact Inquiry Received</h2>
    <p>An inquiry has been submitted via the RAMA INTERNATIONAL contact form:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 30%;">Name:</td>
        <td style="padding: 8px; border-bottom: 1px solid #edf2f7;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Email:</td>
        <td style="padding: 8px; border-bottom: 1px solid #edf2f7;"><a href="mailto:${email}">${email}</a></td>
      </tr>
      ${phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #edf2f7;">${phone}</td></tr>` : ""}
      ${companyName ? `<tr><td style="padding: 8px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Company:</td><td style="padding: 8px; border-bottom: 1px solid #edf2f7;">${companyName}</td></tr>` : ""}
    </table>
    <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; margin-top: 10px;">
      <p style="margin: 0 0 5px 0; font-weight: bold;">Message:</p>
      <p style="margin: 0; white-space: pre-wrap;">${message}</p>
    </div>
  `);
}
