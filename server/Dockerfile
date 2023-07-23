FROM node:18.10.0
WORKDIR /src
COPY package.json tsconfig.json dist/* ./
RUN yarn install
CMD ["yarn", "start:debug"]
EXPOSE 6324