const functions = require('@google-cloud/functions-framework');
const protobuf = require('protobufjs');
const main = require('./src/controllers/scraperController');

async function loadProto() {
  console.log('Loading protos...');
  const root = await protobuf.load('data.proto');
  return root.lookupType('google.events.cloud.firestore.v1.DocumentEventData');
}

async function decodeFirestoreData(DocumentEventData, data) {
  console.log('Decoding data...');
  return DocumentEventData.decode(data);
}

functions.cloudEvent('pupgo', async cloudEvent => {
  const DocumentEventData = await loadProto();
  const firestoreReceived = await decodeFirestoreData(DocumentEventData, cloudEvent.data);
  
  console.log('\nOld value:', JSON.stringify(firestoreReceived.oldValue, null, 2));
  console.log('\nNew value:', JSON.stringify(firestoreReceived.value, null, 2));

  const pushId = firestoreReceived.value.name.split('/').pop();
  console.log('Push ID:', pushId);

  let reviewURL = firestoreReceived.value.fields.url.stringValue;
  console.log('Review URL:', reviewURL);

  let uid = firestoreReceived.value.fields.uid.stringValue;
  console.log('UID:', uid);

  // const url = 'https://maps.app.goo.gl/y1zVscXEZYcjXx5w8';
  try {
    await main(reviewURL, uid, pushId);
  } catch (error) {
    console.error('Error occurred:', error);
  }
});