FROM node:lts-trixie
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install -g corepack && yarn set version stable 
RUN yarn
COPY . .
RUN yarn build
CMD ["node", "dist/server.js"]

EXPOSE 3000