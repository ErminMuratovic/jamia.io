FROM node:6.9.5

MAINTAINER muratovic <office@muratovic.at>

ARG API_PORT=5000
ENV APP=/home/app

WORKDIR $APP

RUN npm install -g typescript@2.3.4

COPY . $APP
RUN npm install && tsc
RUN npm prune --production && npm cache clean

EXPOSE $API_PORT
CMD ["npm", "start"]