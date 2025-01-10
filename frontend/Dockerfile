FROM node:18-alpine
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install
RUN npm run build
EXPOSE 3000