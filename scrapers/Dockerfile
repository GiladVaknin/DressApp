FROM buildkite/puppeteer

WORKDIR /app

COPY "package.json" .

# RUN apt-get update 


RUN npm install --only=prod && npm i puppeteer && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser && mkdir -p /home/pptruser/Downloads && chown -R pptruser:pptruser /home/pptruser && chown -R pptruser:pptruser /node_modules

USER pptruser

COPY . .

EXPOSE 80:80

CMD [ "npm", "start" ]