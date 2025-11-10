import { google } from "googleapis"

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || "./google-credentials.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
})

const drive = google.drive({ version: "v3", auth })

export interface UploadFileOptions {
  fileName: string
  mimeType: string
  fileContent: Buffer | string
  folderId?: string
}

/**
 * Upload a file to Google Drive
 */
export async function uploadToGoogleDrive(options: UploadFileOptions): Promise<string> {
  const { fileName, mimeType, fileContent, folderId } = options

  try {
    const fileMetadata: any = {
      name: fileName,
      parents: folderId ? [folderId] : undefined,
    }

    const media = {
      mimeType,
      body: Buffer.isBuffer(fileContent) ? fileContent : Buffer.from(fileContent),
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink",
    })

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    })

    // Return the direct download link
    return `https://drive.google.com/uc?export=view&id=${response.data.id}`
  } catch (error) {
    console.error("Error uploading to Google Drive:", error)
    throw new Error("Failed to upload file to Google Drive")
  }
}

/**
 * Delete a file from Google Drive
 */
export async function deleteFromGoogleDrive(fileUrl: string): Promise<void> {
  try {
    // Extract file ID from URL
    const fileIdMatch = fileUrl.match(/id=([^&]+)/)
    if (!fileIdMatch) {
      throw new Error("Invalid Google Drive URL")
    }

    const fileId = fileIdMatch[1]
    await drive.files.delete({ fileId })
  } catch (error) {
    console.error("Error deleting from Google Drive:", error)
    throw new Error("Failed to delete file from Google Drive")
  }
}

/**
 * Get file content from Google Drive
 */
export async function getFileFromGoogleDrive(fileUrl: string): Promise<string> {
  try {
    const fileIdMatch = fileUrl.match(/id=([^&]+)/)
    if (!fileIdMatch) {
      throw new Error("Invalid Google Drive URL")
    }

    const fileId = fileIdMatch[1]
    const response = await drive.files.get({ fileId, alt: "media" }, { responseType: "text" })

    return response.data as string
  } catch (error) {
    console.error("Error fetching from Google Drive:", error)
    throw new Error("Failed to fetch file from Google Drive")
  }
}
