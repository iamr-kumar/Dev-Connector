FROM node:14-alpine

# Create app directory
WORKDIR /usr/client/app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Run app
CMD [ "npm", "start" ]
