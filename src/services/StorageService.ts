import { uploadFile } from "@/lib/cloudinary";

export class StorageService {
  /**
   * Uploads file buffer to remote cloud storage (Cloudinary/Supabase) or local system.
   * @param fileBuffer The raw file content buffer.
   * @param fileName The original upload filename.
   * @param folder The folder grouping name (e.g. resumes, passports).
   */
  static async upload(fileBuffer: Buffer, fileName: string, folder: string = "uploads"): Promise<string> {
    // Standardizes cloud storage operations using our dual uploader (Cloudinary with local fail-safe)
    return uploadFile(fileBuffer, fileName, folder);
  }
}
