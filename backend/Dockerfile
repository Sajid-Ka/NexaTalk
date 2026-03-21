# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/uploads/avatars && chown -R appuser:appgroup /app/uploads

USER appuser

EXPOSE 5000

CMD ["node", "dist/main/server.js"]