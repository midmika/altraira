FROM node:20-alpine AS build

RUN npm install -g pnpm
WORKDIR '/app'

RUN pnpm install --frozen-lockfile
RUN pnpm dev '/altv-dev'

#ENV NODE_ENV='development'
#FROM altmp/altv-server:release
#RUN npm install -g pnpm tsx
#
#ENV ALTV_USE_ENV_CONFIG=false
#
#WORKDIR /altv/resources/core/server/
#RUN pnpm i