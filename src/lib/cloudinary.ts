import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

/**
 * Uploads a file buffer to Cloudinary or saves it locally if Cloudinary credentials are not configured.
 * @param fileBuffer The file content as a Buffer.
 * @param fileName The original file name.
 * @param folder The target folder (e.g. 'resumes', 'avatars').
 * @returns The public URL of the uploaded file.
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "uploads"
): Promise<string> {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "your-cloud-name" &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== "your-api-key" &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== "your-api-secret";

  if (isCloudinaryConfigured) {
    try {
      // Dynamic import to avoid crash if cloudinary package is not fully loaded
      const cloudinary = require("cloudinary").v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `rama_international/${folder}`,
            resource_type: "auto",
          },
          (error: any, result: any) => {
            if (error) {
              console.error("Cloudinary upload failed, falling back to local storage:", error);
              // Fallback to local
              resolve(saveLocally(fileBuffer, fileName, folder));
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (e) {
      console.warn("Cloudinary upload error, falling back to local:", e);
      return saveLocally(fileBuffer, fileName, folder);
    }
  } else {
    // Save locally
    return saveLocally(fileBuffer, fileName, folder);
  }
}

async function saveLocally(fileBuffer: Buffer, fileName: string, folder: string): Promise<string> {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    
    // Ensure directories exist
    if (!fs.existsSync(uploadDir)) {
      await mkdirAsync(uploadDir, { recursive: true });
    }

    // Clean filename to prevent path traversal
    const safeName = Date.now() + "_" + fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = path.join(uploadDir, safeName);
    
    await writeFileAsync(filePath, fileBuffer);
    
    // Return relative URL for static serving
    return `/uploads/${folder}/${safeName}`;
  } catch (error) {
    console.error("Failed to save file locally:", error);
    throw new Error("File upload failed");
  }
}
