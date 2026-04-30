FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Electronに必要なシステムライブラリをインストール
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libasound2 \
    libgbm-dev \
    xvfb \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*