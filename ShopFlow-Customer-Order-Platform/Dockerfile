FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S -g 10001 shopflow && adduser -S -u 10001 -G shopflow shopflow
COPY --from=deps --chown=shopflow:shopflow /app/node_modules ./node_modules
COPY --chown=shopflow:shopflow package.json ./
COPY --chown=shopflow:shopflow src ./src
USER 10001:10001
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","src/server.js"]
