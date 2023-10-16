FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts

RUN pnpm build

RUN pnpm prune --prod --config.ignore-scripts=true

EXPOSE 3000

CMD ["node", "./apps/server/dist/server.js"]