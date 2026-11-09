FROM node:24-bookworm-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npx prisma generate && npm run build && npm prune --omit=dev
FROM node:24-bookworm-slim
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV CARE_DATA_DIR=/usr/src/app/data
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
RUN mkdir data && chown node:node data
USER node
EXPOSE 4000
CMD ["node", "dist/src/main.js"]
