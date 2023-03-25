FROM node:16

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
