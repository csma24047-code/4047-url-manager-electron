# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim

##### アプリの依存ソフトインストール #####
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libgbm-dev \
    xvfb \
    fonts-noto-cjk \
    dbus \
    && rm -rf /var/lib/apt/lists/*
######

### Node.js（npm）設定 ###
# 作業ディレクトリを作成し、所有者を node ユーザーに変更
WORKDIR /workspace
RUN chown node:node /workspace

# package.json を node ユーザーの所有権でコピー
COPY --chown=node:node package*.json ./

# node ユーザーに切り替えて npm ci を実行
USER node

# node ユーザーのホームディレクトリ配下にキャッシュをマウント
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/node/.npm \
    npm ci
######