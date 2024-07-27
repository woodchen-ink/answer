# 第一阶段：answer-builder
FROM apache/answer AS answer-builder

# 第二阶段：golang-builder
FROM golang:1.19-alpine AS golang-builder

# 复制 answer 可执行文件
COPY --from=answer-builder /usr/bin/answer /usr/bin/answer

# 安装依赖
RUN apk --no-cache add \
    build-base git bash nodejs npm go && \
    npm install -g pnpm@8.9.2

# 使用 answer 命令构建新的二进制文件
RUN answer build \
    --with github.com/apache/incubator-answer-plugins/connector-basic \
    --with github.com/apache/incubator-answer-plugins/storage-s3 \
    --with github.com/apache/incubator-answer-plugins/search-elasticsearch \
    --with github.com/apache/incubator-answer-plugins/cache-redis \
    --with github.com/apache/incubator-answer-plugins/user-center-wecom \
    --with github.com/answerdev/plugins/cdn-s3 \
    --with github.com/answerdev/plugins/captcha-basic \
    --with github.com/answerdev/plugins/embed-basic \
    --with github.com/answerdev/plugins/editor-chart \
    --with github.com/answerdev/plugins/editor-formula \
    --output /usr/bin/new_answer

# 第三阶段：最终镜像
FROM alpine
LABEL maintainer="linkinstar@apache.org"

ARG TIMEZONE
ENV TIMEZONE=${TIMEZONE:-"Asia/Shanghai"}

RUN apk update \
    && apk --no-cache add \
        bash \
        ca-certificates \
        curl \
        dumb-init \
        gettext \
        openssh \
        sqlite \
        gnupg \
        tzdata \
    && ln -sf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime \
    && echo "${TIMEZONE}" > /etc/timezone

COPY --from=golang-builder /usr/bin/new_answer /usr/bin/answer
COPY --from=answer-builder /data /data
COPY --from=answer-builder /entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

VOLUME /data
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
