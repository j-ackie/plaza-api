FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8000

RUN npm run build

CMD ["node", "dist/index.js"]