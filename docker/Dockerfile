#syntax=docker/dockerfile:1.3-labs

FROM node:lts-alpine
LABEL org.opencontainers.image.source https://github.com/kameshsampath/drone-release-please
LABEL org.opencontainers.image.authors="Kamesh Sampath<kamesh.sampath@hotmail.com>"

ARG TARGETARCH

LABEL description="A Drone plugin to create releases using googleapis/release-please"

RUN apk -Uuv add curl ca-certificates git bash httpie jq

WORKDIR /plugin

COPY ./package.json /plugin/package.json
COPY ./package-lock.json /plugin/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci

# install
COPY . /plugin
RUN npm run build

ADD run.sh /bin/
RUN chmod +x /bin/run.sh

CMD ["/bin/run.sh"]