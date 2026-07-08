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
# 1. 先に node ユーザーに切り替える
USER node

# 2. この状態にすると、WORKDIR がフォルダを「node所有」で自動作成してくれる
WORKDIR /my-workspaces

# 3. package.json をコピー（USER node の状態なので自動で node 所有になります）
COPY package*.json ./

# 4. 直下に node_modules をインストール
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/node/.npm \
    npm ci && rm package*.json
######