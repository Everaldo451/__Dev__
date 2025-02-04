FROM node:18 as build

WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install
RUN npm run build

FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html/dist
EXPOSE 80