FROM node:current-slim

WORKDIR /app

COPY "package.json" .

RUN npm install -g serve

COPY /build .

EXPOSE 5000

CMD [ "serve", "-s", "." ]