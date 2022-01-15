# pull the Node.js Docker image
FROM node:alpine

# install development tools to build native addons
RUN apk update && apk add gcc g++ make &&  \
    apk add --update --no-cache python2 py-pip


# create the directory inside the container
WORKDIR /usr/src/app_service

# copy the package.json files from local machine to the workdir in container
COPY package.json .

# remove node_modules from host and run npm install in our local machine
#RUN rm -rf node_modules && npm install
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 4000

# build project
RUN npm run build:pro

# the command that starts our app
CMD [ "node", "build/index.js" ]