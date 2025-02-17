FROM node:20 AS build
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openjdk-17-jdk

RUN npm install -g firebase-tools

COPY ./firebaseServiceAccount.json . 
COPY ./firebase.json .
COPY ./firestore.indexes.json .
COPY ./firestore.rules .
COPY ./storage.rules .
COPY ./functions/src ./functions/src
COPY ./functions/package.json ./functions/package.json

# WORKDIR /usr/src/app/functions
# RUN npm install --legacy-peer-deps

WORKDIR /usr/src/app
