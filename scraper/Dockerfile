FROM node:22-alpine AS builder
WORKDIR /app/scraper
COPY package.json package-lock.json* ./
RUN npm install
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY tsconfig.json ./
COPY src/ ./src/

FROM node:22-alpine
WORKDIR /app/scraper
RUN mkdir -p /app/data/pages
COPY --from=builder /app/scraper/node_modules ./node_modules
COPY --from=builder /app/scraper/prisma ./prisma
COPY --from=builder /app/scraper/src ./src
COPY --from=builder /app/scraper/tsconfig.json ./
CMD ["npx", "tsx", "src/index.ts", "scrape-and-import"]
