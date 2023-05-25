# We don't want to start from scratch.
# That is why we tell node here to use the current node image as base.
FROM node:lts

# The /app directory should act as the main application directory
WORKDIR /frontend

# Copy the app package and package-lock.json file
COPY /package*.json /frontend

# Install node packages
RUN npm install --legacy-peer-deps

# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY . /frontend

EXPOSE 3000

RUN npm i -f


ENTRYPOINT npm run start