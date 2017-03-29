# Set the base image to Node
FROM node:6

# File Author / Maintainer
MAINTAINER Marcin Mrotek

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE  9000

# Run server
CMD ["npm", "start"]
