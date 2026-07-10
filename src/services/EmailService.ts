export class EmailService {
  /**
   * Dispatches transactional emails via Resend or log fallback.
   * @param to Recipient email address.
   * @param subject Subject line.
   * @param text Text content.
   */
  static async sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    const isConfigured = apiKey && apiKey !== "your-resend-api-key";

    if (isConfigured) {
      try {
        const { Resend } = require("resend");
        const resend = new Resend(apiKey);
        
        await resend.emails.send({
          from: "RAMA INTERNATIONAL-INDIA <recruitment@ramainternational.in>",
          to,
          subject,
          text,
          html: html || undefined,
        });
        
        console.log(`Email successfully dispatched via Resend to ${to}`);
        return true;
      } catch (err) {
        console.error("Resend delivery failed, falling back to mock logger:", err);
        this.logMock(to, subject, text, html);
        return true;
      }
    } else {
      this.logMock(to, subject, text, html);
      return true;
    }
  }

  private static logMock(to: string, subject: string, text: string, html?: string) {
    console.log("=========================================");
    console.log("MOCK EMAIL DISPATCH LOG");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:    ${text}`);
    if (html) {
      console.log("-----------------------------------------");
      console.log(`HTML Payload Available (rendered above as Text)`);
    }
    console.log("=========================================");
  }
}
