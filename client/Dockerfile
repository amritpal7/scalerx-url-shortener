# Stage 1: Build the React app
# Use a lightweight Node.js image
FROM node:20-alpine as builder
WORKDIR /src
COPY . .
RUN npm install && npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.27.4-alpine-slim
COPY --from=builder /src/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

