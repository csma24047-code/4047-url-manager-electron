FROM mcr.microsoft.com/devcontainers/javascript-node:20

WORKDIR /app

# 1. システムライブラリのインストール（一番上に持ってくる）
# ここは頻繁に変更されないため、一度ビルドすれば次回からスキップされます
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libgbm-dev \
    xvfb \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

# 2. 設定ファイルのコピーとインストール
COPY package*.json ./
RUN npm install

# 3. ソースコードのコピー
COPY . .

# 4. 実行コマンド（必ず最後！）
CMD ["npm", "start"]