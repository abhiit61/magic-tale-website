FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
ARG CONFIG=production
RUN npm run build -- --configuration $CONFIG

FROM nginx:stable-alpine AS production

COPY --from=build /app/dist/magic-tale-website/browser /usr/share/nginx/html
COPY --from=build /app/dist/magic-tale-website/browser/index.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
