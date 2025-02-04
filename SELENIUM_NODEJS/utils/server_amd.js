/**
 * Cloud Event Function triggered by a change to a Firestore document.
 */
const functions = require('@google-cloud/functions-framework');
const protobuf = require('protobufjs');

functions.cloudEvent('helloFirestore', async cloudEvent => {
  console.log(`Function triggered by event on: ${cloudEvent.source}`);
  console.log(`Event type: ${cloudEvent.type}`);

  console.log('Loading protos...');
  const root = await protobuf.load('data.proto');
  const DocumentEventData = root.lookupType(
    'google.events.cloud.firestore.v1.DocumentEventData'
  );

  console.log('Decoding data...');
  const firestoreReceived = DocumentEventData.decode(cloudEvent.data);

  console.log('\nOld value:');
  console.log(JSON.stringify(firestoreReceived.oldValue, null, 2));

  console.log('\nNew value:');
  console.log(JSON.stringify(firestoreReceived.value, null, 2));
});