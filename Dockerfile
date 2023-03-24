FROM node:18 AS dependencies

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM node:18 as build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN yarn build
RUN npx prisma generate

FROM node:18 as deploy

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./app/build

EXPOSE 3100

CMD ["yarn", "backend"]