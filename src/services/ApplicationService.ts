import { ApplicationRepository } from "@/repositories/ApplicationRepository";
import { NotificationRepository } from "@/repositories/NotificationRepository";
import { EmailService } from "./EmailService";

export class ApplicationService {
  static async applyToJob(candidateId: string, jobId: string, candidateUserId: string) {
    const app = await ApplicationRepository.create({
      jobId,
      candidateId,
    });

    // Notify candidate
    await NotificationRepository.create(
      candidateUserId,
      "Application Submitted",
      `You successfully applied for the job. Track your application status in your dashboard.`
    );

    // Send email
    const fullApp = await ApplicationRepository.findById(app.id);
    if (fullApp && fullApp.candidate.user.email) {
      await EmailService.sendEmail(
        fullApp.candidate.user.email,
        "Application Received - RAMA INTERNATIONAL-INDIA",
        `Dear ${fullApp.candidate.fullName},\n\nWe have received your application for the role of "${fullApp.job.title}". Our recruiters are currently reviewing your profile.\n\nBest regards,\nRAMA INTERNATIONAL-INDIA Team`
      );
    }

    return app;
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: string,
    visaStatus?: string,
    notes?: string
  ) {
    const updated = await ApplicationRepository.updateStatus(applicationId, status, visaStatus, notes);

    // Fetch full application to get candidate details
    const app = await ApplicationRepository.findById(applicationId);
    if (app) {
      // Notify candidate via live alerts
      await NotificationRepository.create(
        app.candidate.userId,
        `Application Status: ${status}`,
        `Your application status for "${app.job.title}" has been updated to "${status}".`
      );

      // Email candidate
      if (app.candidate.user.email) {
        await EmailService.sendEmail(
          app.candidate.user.email,
          `Application Status Updated: ${status}`,
          `Dear ${app.candidate.fullName},\n\nYour application status for "${app.job.title}" is now "${status}".\nNotes: ${notes || "No additional comments."}\n\nTrack your progress in the dashboard.\n\nBest regards,\nRAMA INTERNATIONAL-INDIA Team`
        );
      }
    }

    return updated;
  }
}
