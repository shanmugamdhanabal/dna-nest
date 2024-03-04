# Base image
FROM node:latest

# Create app directory
WORKDIR /app

COPY . .

# A wildcard is used to ensure both package.json AND package-lock.json are copied


# Install app dependencies
COPY package*.json ./
RUN npm install 
#RUN npm install -g sqlite3-transactions --save
RUN apt-get update && apt-get install -y apt-transport-https
#RUN apt-get install -y nodejs

RUN apt install -y sqlite3
#RUN npm install -y sqlite --save
RUN npm install -y sqlite3 --save
RUN mkdir /db
#RUN chmod -R 777 /db/sql
RUN /usr/bin/sqlite3 /db/sql

# Bundle app source


# Copy the .env and .env.development files
#COPY .env .env.development ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3001

# Start the server using the production build
#CMD ["/bin/bash"]
CMD ["npm", "run", "start:dev"]

