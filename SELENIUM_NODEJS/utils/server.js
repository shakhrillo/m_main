const express = require('express');
const bodyParser = require('body-parser');
const protobuf = require('protobufjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

app.post('/firestore', async (req, res) => {
  const cloudEvent = req.body; // Getting the entire request body
  console.log(`Function triggered by event on: ${cloudEvent.resource ? cloudEvent.resource.name : 'Unknown resource'}`);
  console.log(`Event type: ${cloudEvent.logName}`);

  // Check if the payload is present
  if (cloudEvent.payload === "payloadNotSet") {
    console.log("No payload received.");
    return res.status(400).send('No payload received');
  }

  try {
    console.log('Loading protos...');
    const root = await protobuf.load('data.proto');
    const DocumentEventData = root.lookupType(
      'google.events.cloud.firestore.v1.DocumentEventData'
    );

    // Assuming you need to decode the event data from the payload, 
    // but since the payload is "payloadNotSet," you would need to handle that case.
    const firestoreData = {}; // Placeholder for your decoded data

    // If you have an actual payload, decode it here
    if (cloudEvent.payload && cloudEvent.payload !== "payloadNotSet") {
      const decodedData = DocumentEventData.decode(Buffer.from(cloudEvent.payload, 'base64'));
      firestoreData.oldValue = decodedData.oldValue; // Replace with actual property
      firestoreData.value = decodedData.value; // Replace with actual property

      console.log('\nOld value:');
      console.log(JSON.stringify(firestoreData.oldValue, null, 2));

      console.log('\nNew value:');
      console.log(JSON.stringify(firestoreData.value, null, 2));
    } else {
      console.log("No valid payload to decode.");
    }

    // Respond to Firestore with a success message
    res.status(200).send('Event processed successfully');
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
