FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN apt update -y
RUN apt install libsecret-1-0 -y

EXPOSE 8545

CMD [ "npm", "run", "start"]
