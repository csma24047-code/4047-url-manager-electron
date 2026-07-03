# syntax=docker/dockerfile:1
FROM node:20-slim

### ユーザー作成設定 ###
USER root
# 既存の node ユーザー(1000:1000)を vscode に名前変更し、sudo 権限を与える
RUN usermod -l vscode node \
    && groupmod -n vscode node \
    && usermod -d /home/vscode -m vscode \
    && apt-get update && apt-get install -y sudo \
    && echo vscode ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode \
    && rm -rf /var/lib/apt/lists/*
####################################

### Node.js（npm）設定 ###
# 明示的に作業ディレクトリを設定する
WORKDIR /workspace
RUN chown vscode:vscode /workspace

# キャッシュマウントを使ってインストール (所有者を vscode に変更してコピー)
COPY --chown=vscode:vscode package*.json ./

# 一般ユーザーに切り替えてから npm ci を実行（rootでのパーミッション汚染を防ぐ）
USER vscode
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/vscode/.npm \
    npm ci
######


### Zsh設定 ###
# 1. zshとcurl(インストーラ用)が未導入の場合に備えてrootでインストール
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    zsh \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 2. 構築を行う一般ユーザに切り替え
USER vscode
ENV HOME=/home/vscode

# 3. oh-my-zsh 本体のインストール (未導入の場合のみ実行)
RUN if [ ! -d "$HOME/.oh-my-zsh" ]; then \
        sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended; \
    fi

# 4. 追加プラグインのインストール (既存チェックを入れて2回目以降のビルドエラーを防ぐ)
RUN [ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions" ] && \
    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions || true
RUN [ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting" ] && \
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting || true

# 5. .zshrc のプラグイン記述を有効化
#    (本体インストール時に自動で .zshrc が作られるため、plugins の置換のみ安全に行う)
RUN if [ -f "$HOME/.zshrc" ]; then \
        sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' "$HOME/.zshrc"; \
    fi
######


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

USER vscode
######