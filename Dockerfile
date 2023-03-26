FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install
RUN npx prisma generate
RUN yarn build

EXPOSE 3100

ENV DATABASE_URL="mysql://apps:Guro6297@db.jackcrane.rocks:3306/paddlefest_volunteer"
ENV SENDGRID_API_KEY="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"

CMD [ "yarn", "backend" ]