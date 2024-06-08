## ssh key generator
FROM ubuntu as ssh-gen

WORKDIR /usr/src/keys

# Install openssl before running the script
RUN apt-get update && apt-get install -y openssl
RUN mkdir rsa
RUN openssl genrsa -out rsa/private.key 2048
RUN openssl rsa -pubout -in rsa/private.key -out rsa/public.key

## node app builder
FROM node as builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

## docker image
FROM node:slim
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production

# copy the built node app from the builder
COPY --from=builder /usr/src/app/dist ./dist

# get the generated ssh keys from the key generator
COPY --from=ssh-gen /usr/src/keys/rsa ./rsa
USER root
RUN chmod 444 ./rsa/*
USER node

EXPOSE 8080

# header size larger because of jwt
CMD [ "node", "--max-http-header-size=65536", "dist/index.js" ]