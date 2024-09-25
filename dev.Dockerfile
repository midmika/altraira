FROM node:20-alpine AS build

RUN npm install -g pnpm
WORKDIR '/app'

RUN pnpm install --frozen-lockfile
RUN pnpm build development

ENV NODE_ENV='development'

RUN npm dev