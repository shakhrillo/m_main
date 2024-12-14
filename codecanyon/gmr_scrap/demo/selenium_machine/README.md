docker buildx build -t gmr_scrap_selenium .
docker buildx build --platform linux/amd64 -t gmr_scrap_selenium .

docker build -t gcr.io/fir-scrapp/gmr_scrap_selenium:latest .

<!-- gcloud artifacts repositories create [REPOSITORY_NAME] \
  --repository-format=docker \
  --location=[LOCATION] -->

<!-- gcloud artifacts repositories create fir-scrapp \
  --repository-format=docker \
  --location=us-central1 -->

docker push gcr.io/fir-scrapp/gmr_scrap_selenium:latest

gcloud run deploy gmr-scrap-selenium --image gcr.io/fir-scrapp/gmr_scrap_selenium:latest --platform managed --region us-central1 --allow-unauthenticated

<!-- gs://machine_gmr_scrap/machine.zip -->

gsutil ls gs://machine_gmr_scrap/machine.zip

# Variables

INSTANCE_NAME="temp-instance"
ZONE="us-central1-a"
MACHINE_TYPE="n1-standard-1"
BUCKET_NAME="your-bucket-name"
ZIP_FILE_PATH="path/to/your-file.zip"

# Create VM with startup script

gcloud compute instances create "$INSTANCE_NAME" \
  --zone="$ZONE" \
 --machine-type="$MACHINE_TYPE" \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --metadata startup-script="#! /bin/bash
    apt-get update && apt-get install -y unzip wget
    wget -O /tmp/your-archive.zip https://storage.googleapis.com/$BUCKET_NAME/$ZIP_FILE_PATH
unzip /tmp/your-archive.zip -d /tmp/your-project
cat <<EOF > /tmp/your-project/.env
ENV_VAR1=value1
ENV_VAR2=value2
ENV_VAR3=value3
EOF
cd /tmp/your-project && ./your-script.sh
"
