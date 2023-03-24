FROM node:18 AS dependencies

WORKDIR /
COPY package.json yarn.lock ./
RUN yarn

FROM node:18 as build

WORKDIR /
COPY --from=dependencies /node_modules ./node_modules
COPY . .

RUN yarn build
RUN npx prisma generate

FROM node:18 as deploy

WORKDIR /

COPY --from=build /node_modules ./node_modules
COPY --from=build /app/build ./build

EXPOSE 3100

CMD ["yarn", "backend"]