FROM mcr.microsoft.com/devcontainers/javascript-node:20

WORKDIR /app

USER root

# システムライブラリのインストール（一番上に持ってくる）
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libgbm-dev \
    xvfb \
    fonts-noto-cjk \
    dbus \
    && rm -rf /var/lib/apt/lists/*

# 先にフォルダを作って、所有者を node に変えておく(devcontainerのmountsでエラーを出さないために)
RUN mkdir -p /home/node/.vscode-server/extensions && \
    chown -R node:node /home/node/.vscode-server

# 明示的にユーザを示す。以降の命令（npm installなど）は node ユーザーとして実行
USER node