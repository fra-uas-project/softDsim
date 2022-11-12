FROM node:17-alpine

WORKDIR /app

# copy package.json to root
COPY package.json . 

RUN npm install --legacy-peer-deps

# copy everything to /app
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

