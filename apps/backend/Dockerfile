# BASE
FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache ffmpeg python3 yt-dlp
RUN npm install -g nx

# DEVELOPMENT
FROM base AS development
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate --schema apps/backend/prisma/schema.prisma
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma && npx nx serve backend --host=0.0.0.0"]

# BUILDER
FROM base AS builder
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate --schema apps/backend/prisma/schema.prisma
RUN npx nx build backend --prod

# PRODUCTION
FROM node:22-alpine AS production
WORKDIR /usr/src/app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
COPY --from=builder /usr/src/app/dist/apps/backend ./dist
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --only=production --legacy-peer-deps
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]
