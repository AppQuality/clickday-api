FROM node:18-alpine3.16 AS node
FROM alpine:3.16 as base

RUN apk add nodejs yarn
COPY package.json ./
COPY yarn.lock ./
ARG NPM_TOKEN  
RUN echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > .npmrc
RUN yarn --ignore-scripts
RUN rm .npmrc

COPY . .

RUN yarn build

FROM alpine:3.14 as web

COPY --from=base /dist /app/build
COPY package*.json /app/
COPY --from=base /src/routes /app/src/routes
COPY --from=base /.git/HEAD /app/.git/HEAD
COPY --from=base /.git/refs /app/.git/refs
WORKDIR /app
RUN apk add yarn
ARG NPM_TOKEN  
RUN echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > .npmrc
RUN --mount=type=cache,target=/yarn-cache yarn --prod --ignore-scripts --cache-folder /yarn-cache
RUN rm .npmrc
CMD node build/index.js