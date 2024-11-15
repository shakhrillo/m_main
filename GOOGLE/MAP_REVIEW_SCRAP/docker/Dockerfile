# Use an official base image
FROM ubuntu:20.04

# Set environment variables to avoid prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    wget \
    curl \
    ca-certificates \
    --no-install-recommends

# Now download and install Google Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb && \
    apt-get install -f -y && \
    rm google-chrome-stable_current_amd64.deb

# Set the default command to run Chrome in headless mode
CMD ["google-chrome-stable", "--headless", "--no-sandbox", "--disable-dev-shm-usage"]
