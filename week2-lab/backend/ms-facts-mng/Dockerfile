FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY api ./api
COPY application ./application
COPY domain ./domain
COPY infrastructure ./infrastructure

RUN npm run build

EXPOSE 3106

CMD ["npm", "start"]