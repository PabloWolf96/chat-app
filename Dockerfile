FROM ubuntu:20.04
EXPOSE 3000
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -y nodejs
COPY package.json .
RUN npm install
COPY . .
CMD node index.js