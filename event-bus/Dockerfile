FROM node:23.3.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "dev"]