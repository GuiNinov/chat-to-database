FROM node:18-alpine

# Create app directory

WORKDIR /app

# Install app dependencies

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build



