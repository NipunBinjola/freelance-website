FROM node:12.16.1-alpine3.9 as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm i
COPY . ./

CMD ["npm", "start"]
