# Base image
FROM node:latest

# Create app directory
WORKDIR /app

COPY . .

# A wildcard is used to ensure both package.json AND package-lock.json are copied

# Install app dependencies
COPY package*.json ./

#Install Node 
RUN npm install 
RUN apt-get update && apt-get install -y apt-transport-https

#Install sqlite 3 and configure it
RUN apt install -y sqlite3
RUN npm install -y sqlite3 --save
RUN mkdir /db
RUN /usr/bin/sqlite3 /db/sql

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
#CMD ["/bin/bash"]
CMD ["npm", "run", "start:dev"]

