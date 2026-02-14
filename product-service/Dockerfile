# Use official node image
FROM node:18-alpine

# create app directory
WORKDIR /app

# copy package files first (docker cache optimization)
COPY package*.json ./

# install dependencies
RUN npm install

# copy project files
COPY . .

# service port
EXPOSE 3000

# run application
CMD ["npm","start"]
