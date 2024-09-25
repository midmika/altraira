FROM node:20-alpine AS build

RUN npm install -g pnpm
WORKDIR '/app'
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build production

FROM altmp/altv-server:release
RUN npm install -g pnpm tsx

ENV NODE_ENV=true
ENV ALTV_USE_ENV_CONFIG=false

COPY --from=build /app/dist /altv

WORKDIR /altv/resources/core/server/
RUN pnpm i