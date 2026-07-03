# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/devcontainers/javascript-node:20

##### アプリの依存ソフトインストール #####
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libgbm1 \
    xvfb \
    fonts-noto-cjk \
    dbus \
    && rm -rf /var/lib/apt/lists/*

### Node.js（npm）設定 ###
WORKDIR /workspace

# package.json をコピー（root のままでOK）
COPY package*.json ./

# キャッシュマウントを使いつつ、root のまま npm ci を実行
# （rootなので uid/gid 指定は不要になります。マウント先は root 用の場所に）
RUN --mount=type=cache,target=/root/.npm \
    npm ci