const { readFileSync } = require("fs");
const { getStorage } = require("firebase-admin/storage");
const { Storage } = require("@google-cloud/storage");

const uploadFile = async (fileBuffer, destination) => {
  // const file = new File([fileBuffer], destination);
  // const templateContent = readFileSync(file);

  // http://127.0.0.1:9199/v0/b/fir-scrapp.firebasestorage.app/o?name=migzant-365.png
  // const img = await fetch(
  //   `http://host.docker.internal:9199/v0/b/fir-scrapp.firebasestorage.app/o?name=${destination}`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/octet-stream",
  //     },
  //     body: fileBuffer,
  //   }
  // );

  // const storage = getStorage();
  const storage = new Storage({
    apiEndpoint: "http://host.docker.internal:9199", // Use HTTP for local emulator
  });
  const bucket = storage.bucket("fir-scrapp.appspot.com");
  const file = bucket.file(destination);

  await file.save(fileBuffer, {
    resumable: false,
    public: "yes",
  });

  // http://127.0.0.1:4000/storage/fir-scrapp.appspot.com/lBrPfDyEPUmpdl1ObfJtWKiQZxhy/8NEJHzFFmWV6Yb7c9#:~:text=Name-,screenshot,-.png
  const publicUrl = file.publicUrl();

  console.log(`publicUrl: ${publicUrl}`);

  return publicUrl.replace("host.docker.internal", "localhost");

  // return new Promise((resolve, reject) => {

  // const storage = getStorage();
  // const bucket = storage.bucket("fir-scrapp.appspot.com");
  // const file = bucket.file(destination);

  // try {
  //   const file = bucket.file(destination);
  //   const stream = file.createWriteStream({
  //     metadata: {
  //       contentType: "application/octet-stream", // Change as needed
  //     },
  //   });

  //   stream.on("error", (error) => {
  //     console.error("Error uploading file:", error);
  //     reject(error); // Reject the promise on error
  //   });

  //   stream.on("finish", async () => {
  //     console.log(`${destination} uploaded to Firebase Storage`);

  //     try {
  //       // Get the public URL of the uploaded file
  //       const [url] = await file.getSignedUrl({
  //         action: "read",
  //         expires: "03-09-2491", // Set an expiration date far in the future
  //       });
  //       resolve(url); // Return the URL
  //     } catch (error) {
  //       console.error("Error generating signed URL:", error);
  //       reject(error); // Reject if error in generating URL
  //     }
  //   });

  //   stream.end(fileBuffer);
  // } catch (error) {
  //   console.error("Error uploading file:", error);
  //   reject(error); // Reject the promise if there's a catch error
  // }
  // });
};

// Export the upload function
module.exports = {
  uploadFile,
};
