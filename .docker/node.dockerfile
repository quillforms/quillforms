FROM node:14.18-alpine

WORKDIR /usr/src/app

EXPOSE 35729

CMD npm run dev
