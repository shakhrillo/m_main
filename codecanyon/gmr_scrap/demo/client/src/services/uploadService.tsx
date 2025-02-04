import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseConfig";

export const uploadFile = async (fileBuffer: any, destination: any) => {
  try {
    const fileRef = ref(storage, `${destination}/${Date.now()}`);

    const file = new Blob([fileBuffer]);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};
