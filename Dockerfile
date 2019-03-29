FROM node:8.11.1


RUN mkdir -p /usr/src/app


# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 2018

CMD [ "npm", "start", "kalpatharu" ]