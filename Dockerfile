FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache openssl

WORKDIR /app
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
