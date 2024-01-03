FROM node:20-slim as base
RUN apt-get update && \
    apt-get install -y python3 curl git build-essential psmisc && \
    apt-get clean

COPY . /app
WORKDIR /app

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN pnpm install

FROM node:20-slim as prod
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean  -y && \
    rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app

COPY --from=base /app/node_modules /app/node_modules

ENV DEV_CHAIN_ID=313371
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm hardhat compile

ENTRYPOINT ./docker/deploy-contracts.sh
