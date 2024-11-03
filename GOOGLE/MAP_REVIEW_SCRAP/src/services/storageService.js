const { bucket } = require("./firebaseAdmin");

const uploadFile = async (fileBuffer, destination) => {
    try {
        const file = bucket.file(destination);
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'application/octet-stream', // Change as needed
            },
        });

        stream.on('error', (error) => {
            console.error('Error uploading file:', error);
            throw error;
        });

        stream.on('finish', () => {
            console.log(`${destination} uploaded to Firebase Storage`);
        });

        stream.end(fileBuffer);
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Rethrow error for handling in the controller
    }
};

// Export the upload function
module.exports = {
    uploadFile,
};
