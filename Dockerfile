FROM node:12.16.3-alpine
MAINTAINER Logan Crandall <logan@accidentallycoded.com>

WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
COPY . /app

EXPOSE 8080

RUN yarn

CMD [ "yarn", "start" ]
