FROM mcr.microsoft.com/devcontainers/javascript-node:20

WORKDIR /app

# 1. システムライブラリのインストール（一番上に持ってくる）
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libgbm-dev \
    xvfb \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*
