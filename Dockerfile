FROM golang:1.19-alpine AS golang-builder
LABEL maintainer="aichy@sf.com"

ARG GOPROXY
ENV GOPATH /go
ENV GOROOT /usr/local/go
ENV PACKAGE github.com/apache/incubator-answer
ENV BUILD_DIR ${GOPATH}/src/${PACKAGE}
ENV ANSWER_MODULE ${BUILD_DIR}

ARG TAGS="sqlite sqlite_unlock_notify"
ENV TAGS "bindata timetzdata $TAGS"
ARG CGO_EXTRA_CFLAGS

# Install build dependencies
RUN apk --no-cache add build-base git bash nodejs npm && \
    npm install -g pnpm@8.9.2

# Copy only necessary files for dependency installation
COPY go.mod go.sum ${BUILD_DIR}/
WORKDIR ${BUILD_DIR}

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
RUN make clean build && \
    chmod 755 answer && \
    /bin/bash -c "script/build_plugin.sh" && \
    cp answer /usr/bin/answer

# Prepare data directories
RUN mkdir -p /data/uploads && chmod 777 /data/uploads && \
    mkdir -p /data/i18n && cp -r i18n/*.yaml /data/i18n

# Final stage
FROM alpine
LABEL maintainer="linkinstar@apache.org"

ARG TIMEZONE
ENV TIMEZONE=${TIMEZONE:-"Asia/Shanghai"}

RUN apk update && \
    apk --no-cache add bash ca-certificates curl dumb-init gettext openssh sqlite gnupg tzdata && \
    ln -sf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && \
    echo "${TIMEZONE}" > /etc/timezone

COPY --from=golang-builder /usr/bin/answer /usr/bin/answer
COPY --from=golang-builder /data /data
COPY /script/entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

VOLUME /data
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
