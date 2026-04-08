FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Create the data directory for sqlite
RUN mkdir -p /data

# Expose port
EXPOSE 3001

# Command to run our app
CMD [ "npm", "start" ]
