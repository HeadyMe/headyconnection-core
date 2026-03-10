FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --production

FROM node:20-slim
WORKDIR /app

RUN groupadd -r heady && useradd -r -g heady heady

COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
COPY index.js site-config.json ./

RUN chown -R heady:heady /app
USER heady

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http');const r=http.get('http://localhost:8080/health',s=>{process.exit(s.statusCode===200?0:1)});r.on('error',()=>process.exit(1))"

CMD ["node", "index.js"]
