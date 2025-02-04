// storageController.js

const { uploadFile } = require("../services/storageService");

const handleFileUpload = async (req, res) => {
  try {
      // Check if a file path is provided
      const localFilePath = req.body.filePath; // Assuming the file path is sent in the request body

      if (!localFilePath || !fs.existsSync(localFilePath)) {
          return res.status(400).send('Invalid or no file path provided.');
      }

      // Read the file from the local file system
      const fileBuffer = fs.readFileSync(localFilePath);
      const destination = path.basename(localFilePath); // Use the base name of the file

      // Upload the file to Firebase Storage
      await uploadFile(fileBuffer, destination);

      res.status(200).send(`File uploaded: ${destination}`);
  } catch (error) {
      console.error('Error during file upload:', error);
      res.status(500).send('Error uploading file.');
  }
};

// Export the upload middleware and the route handler
module.exports = {
  handleFileUpload,
};
