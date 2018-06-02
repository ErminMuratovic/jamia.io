FROM nginx:1.13.9-alpine
MAINTAINER muratovic <office@muratovic.at>

ARG compileargs

ENV TEMP="/tmp/app"
ENV NGINX_HTML="/usr/share/nginx/html"

RUN apk add --no-cache bash=4.4.19-r1 &&\
    apk add --no-cache openssl &&\
    apk add --no-cache nodejs

WORKDIR $TEMP

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

RUN npm install -g typescript@2.3.4
COPY package.json tsconfig.json $TEMP/
COPY . $TEMP/
RUN npm install

RUN npm run compile -- ${compileargs}
RUN cp -R ./dist/* $NGINX_HTML/
RUN cp -R ./src/_assets/* $NGINX_HTML/_assets/
RUN rm -Rf $TEMP &&\
    apk del nodejs

EXPOSE 443 80
