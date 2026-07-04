FROM node:18-slim
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 7001

CMD ["node", "src/index.js"]