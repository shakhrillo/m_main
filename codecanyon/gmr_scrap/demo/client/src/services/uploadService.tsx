import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseConfig";

/**
 * Uploads a file to the specified destination.
 * 
 * @param fileBuffer The file buffer to upload.
 * @param destination The destination path to upload the file.
 * @returns The download URL of the uploaded file.
 * @throws Error if the file buffer or destination path is invalid.
 */
export const uploadFile = async (fileBuffer: ArrayBuffer | Uint8Array, destination: string): Promise<string | null> => {
  try {
    if (!fileBuffer || !destination) throw new Error("Invalid file buffer or destination path");

    const fileRef = ref(storage, `${destination}/${Date.now()}`);
    const fileBlob = new Blob([fileBuffer]);

    await uploadBytes(fileRef, fileBlob);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
