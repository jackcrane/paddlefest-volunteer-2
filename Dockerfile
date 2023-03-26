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

RUN chmod +x ./start.sh
CMD [ "./start.sh" ]