FROM node:18 AS build

WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest

ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80

CMD nginx -g "daemon off;"