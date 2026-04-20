# syntax=docker/dockerfile:1.6

# --- Base image for building (always track latest current Node) ---
ARG NODE_IMAGE=node:current-slim
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build client assets (also runs islands manifest script)
RUN npm run build:client
RUN test -f dist/client/islands-manifest.json && test -d dist/client/assets

# --- Runtime image ---
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built artifacts and server code
COPY --from=builder /app/dist/client ./dist/client
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000
CMD ["node", "--loader", "@esbuild-kit/esm-loader", "src/server/index.js"]
