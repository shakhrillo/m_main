gcloud functions deploy helloFirestore2 \
    --runtime nodejs20 \
    --region=us-central1 \
    --trigger-location=nam5 \
    --entry-point helloFirestore2 \
    --source . \
    --allow-unauthenticated \
    --trigger-event-filters=type=google.cloud.firestore.document.v1.created \
    --trigger-event-filters=database='(default)'