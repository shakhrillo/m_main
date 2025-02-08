FROM node:18 AS build
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openjdk-17-jdk
COPY .env firebaseServiceAccount.json firebase.json firestore.indexes.json firestore.rules package.json storage.rules ./

RUN npm install -g firebase-tools

WORKDIR /usr/src/app/functions
COPY functions .env ./
RUN npm install --legacy-peer-deps
RUN rm package-lock.json

WORKDIR /usr/src/app
CMD ["/usr/src/app/firebase.sh"]