FROM node:22-alpine

WORKDIR /app

COPY backend/ms-facts-mng/package*.json ./

RUN npm install

COPY backend/ms-facts-mng/tsconfig.json ./
COPY backend/ms-facts-mng/api ./api
COPY backend/ms-facts-mng/application ./application
COPY backend/ms-facts-mng/domain ./domain
COPY backend/ms-facts-mng/infrastructure ./infrastructure

RUN npm run build

EXPOSE 3106

CMD ["npm", "start"]
