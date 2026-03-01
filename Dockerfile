# syntax=docker/dockerfile:1.6

# --- Base image for building (always track latest current Node) ---
ARG NODE_IMAGE=node:current-slim
ARG YARN_VERSION=1.22.22
FROM ${NODE_IMAGE} AS builder
ARG YARN_VERSION
WORKDIR /app

# Install Yarn v1 explicitly (corepack is missing in some slim variants)
RUN if ! command -v yarn >/dev/null 2>&1; then npm install -g yarn@${YARN_VERSION}; fi

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build client assets (also runs islands manifest script)
RUN yarn build:client
RUN test -f dist/client/islands-manifest.json && test -d dist/client/assets

# --- Runtime image ---
FROM ${NODE_IMAGE} AS runner
ARG YARN_VERSION
WORKDIR /app
ENV NODE_ENV=production

# Install Yarn v1 explicitly (corepack is missing in some slim variants)
RUN if ! command -v yarn >/dev/null 2>&1; then npm install -g yarn@${YARN_VERSION}; fi

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy built artifacts and server code
COPY --from=builder /app/dist/client ./dist/client
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000
CMD ["node", "--loader", "@esbuild-kit/esm-loader", "src/server/index.js"]
