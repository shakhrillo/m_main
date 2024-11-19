docker build --platform linux/amd64 -t map_review_scraperx .

docker run -d --name mx map_review_scraperx --memory="8g" --cpus="4"
