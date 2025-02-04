const { bucket } = require("./firebase");

const uploadFile = async (fileBuffer, destination) => {
  return new Promise((resolve, reject) => {
    try {
      const file = bucket.file(destination);
      const stream = file.createWriteStream({
        metadata: {
          contentType: "application/octet-stream", // Change as needed
        },
      });

      stream.on("error", (error) => {
        console.error("Error uploading file:", error);
        reject(error); // Reject the promise on error
      });

      stream.on("finish", async () => {
        console.log(`${destination} uploaded to Firebase Storage`);

        try {
          // Get the public URL of the uploaded file
          const [url] = await file.getSignedUrl({
            action: "read",
            expires: "03-09-2491", // Set an expiration date far in the future
          });
          resolve(url); // Return the URL
        } catch (error) {
          console.error("Error generating signed URL:", error);
          reject(error); // Reject if error in generating URL
        }
      });

      stream.end(fileBuffer);
    } catch (error) {
      console.error("Error uploading file:", error);
      reject(error); // Reject the promise if there's a catch error
    }
  });
};

// Export the upload function
module.exports = {
  uploadFile,
};
