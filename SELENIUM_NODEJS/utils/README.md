gcloud functions deploy helloFirestore2 \
    --runtime nodejs20 \
    --region=us-central1 \
    --trigger-location=nam5 \
    --entry-point helloFirestore2 \
    --source . \
    --allow-unauthenticated \
    --trigger-event-filters=type=google.cloud.firestore.document.v1.created \
    --trigger-event-filters=database='(default)'



gcloud functions deploy messagewatch \
    --gen2 \
    --runtime nodejs20 \
    --region=us-central1 \
    --trigger-location=nam5 \
    --entry-point messagewatch \
    --cpu=8 \
    --memory=8GB \
    --timeout=540s \
    --source . \
    --allow-unauthenticated \
    --trigger-event-filters=type=google.cloud.firestore.document.v1.created \
    --trigger-event-filters=database='(default)' \
    --trigger-event-filters-path-pattern=document='messages/{pushId}'



gcloud functions deploy messagewatch \
    --gen2 \
    --runtime nodejs20 \
    --region=us-central1 \
    --trigger-location=nam5 \
    --entry-point messagewatch \
    --cpu=8 \
    --memory=8GB \
    --timeout=540s \
    --source . \
    --allow-unauthenticated \
    --trigger-event-filters=type=google.cloud.firestore.document.v1.created \
    --trigger-event-filters=database='(default)' \
    --trigger-event-filters-path-pattern=document='users/{uid}/reviews/{pushId}'