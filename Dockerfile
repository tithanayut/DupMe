FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build

RUN pnpm prune --prod --config.ignore-scripts=true

EXPOSE 3000

CMD ["pnpm", "start"]