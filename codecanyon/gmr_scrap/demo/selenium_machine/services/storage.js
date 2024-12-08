const { readFileSync } = require("fs");
const { getStorage } = require("firebase-admin/storage");
const { Storage } = require("@google-cloud/storage");

const uploadFile = async (fileBuffer, destination) => {
  const storage = new Storage({
    apiEndpoint: "http://host.docker.internal:9199",
  });
  const bucket = storage.bucket("fir-scrapp.appspot.com");
  const file = bucket.file(destination);

  try {
    await file.save(fileBuffer, {
      resumable: false,
      public: "yes",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
  }

  const publicUrl = file.publicUrl();

  console.log(`${destination} uploaded to Firebase Storage`);

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
