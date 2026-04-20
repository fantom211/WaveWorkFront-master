FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY front-nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]