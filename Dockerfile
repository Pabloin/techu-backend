FROM node:10-alpine

RUN apk add g++ make python

RUN mkdir -p /app/node_modules && \
    chown -R node:node /app

WORKDIR /app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "src/bin/www" ]



