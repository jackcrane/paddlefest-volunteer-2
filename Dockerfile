FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npx prisma generate

# Bundle app source
COPY . .

EXPOSE 3100

ENV DATABASE_URL="mysql://apps:Guro6297@db.jackcrane.rocks:3306/paddlefest_volunteer"
ENV SENDGRID_API_KEY="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"

CMD [ "yarn", "backend" ]