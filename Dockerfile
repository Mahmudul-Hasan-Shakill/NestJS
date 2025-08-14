# Build stage
FROM node:22.17.0-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and env
COPY . .
COPY .env.production .env.production

# Build the NestJS app
RUN npm run build

# Production stage
FROM node:22.17.0-alpine

WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy built assets and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env.production .env.production

# Expose port and start the app
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
