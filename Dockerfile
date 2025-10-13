FROM node:21.1.0-alpine

WORKDIR /usr/src/ac

RUN apk --no-cache add bash curl grep tzdata

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 7000 7001

CMD ["npm", "start"]
