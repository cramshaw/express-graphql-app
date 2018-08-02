FROM node:carbon

WORKDIR /usr/src/app

COPY yarn.lock ./
COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]