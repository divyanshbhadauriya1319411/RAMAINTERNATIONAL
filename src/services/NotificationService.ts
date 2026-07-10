import { NotificationRepository } from "@/repositories/NotificationRepository";

export class NotificationService {
  static async sendNotification(userId: string, title: string, message: string) {
    return NotificationRepository.create(userId, title, message);
  }

  static async getUserNotifications(userId: string) {
    return NotificationRepository.getByUser(userId);
  }

  static async markAsRead(userId: string) {
    return NotificationRepository.markAllAsRead(userId);
  }
}
