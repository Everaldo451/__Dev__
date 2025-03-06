FROM node:18 AS build

WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest

COPY /nginx/default.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]