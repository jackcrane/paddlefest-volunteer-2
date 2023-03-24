FROM node:16-alpine AS base
WORKDIR /usr/src/app
RUN apk update \ 
  && apk add bash \
  && rm -rf /var/cache/apk/*
COPY . . 
RUN yarn install
RUN cd app && yarn install
RUN yarn build
EXPOSE 3100
RUN npx prisma generate
CMD ["yarn", "backend"]