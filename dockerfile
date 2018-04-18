FROM node:8-alpine

MAINTAINER Ryan Guill

ENV NODE_ENV=production
ENV PORT=3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY tsconfig.json /usr/src/app/
RUN npm install

# Copy app source
COPY src /usr/src/app/src

# Compile app sources
RUN npm run compile

# Remove dev dependencies
RUN npm prune --production

EXPOSE $PORT
CMD [ "npm", "run", "prod-start" ]