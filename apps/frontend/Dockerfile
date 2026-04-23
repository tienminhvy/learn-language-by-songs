# BASE
FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g nx

# DEVELOPMENT
FROM base AS development
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 4200
CMD ["npx", "nx", "serve", "frontend", "--host=0.0.0.0", "--disable-host-check"]

# BUILDER
FROM base AS builder
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx nx build frontend --prod

# PRODUCTION
FROM nginx:stable-alpine AS production
# Copy build output to nginx path
COPY --from=builder /usr/src/app/dist/apps/frontend/browser /usr/share/nginx/html
# Copy custom nginx config if needed, or use default
# RUN rm /etc/nginx/conf.d/default.conf
# COPY apps/frontend/nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
