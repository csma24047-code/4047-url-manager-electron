# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim

##### アプリの依存ソフトインストール #####
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    sudo \
    git \
    zsh \
    ca-certificates \
    curl \
    python3 \
    python3-pip \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libgbm-dev \
    xvfb \
    fonts-noto-cjk \
    dbus \
    && rm -rf /var/lib/apt/lists/*

# node ユーザーがパスワードなしで sudo を実行できるように設定
RUN echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node
######

### ユーザー作業 ###
USER node
WORKDIR /workspaces/url-manager-electron
# Oh My Zsh のインストール
ENV HOME=/home/node
ENV ZSH_CUSTOM_DIR=$HOME/.oh-my-zsh/custom
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
    && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM_DIR}/plugins/zsh-autosuggestions \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM_DIR}/plugins/zsh-syntax-highlighting \
    && git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM_DIR}/plugins/zsh-completions \
    && sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-completions zsh-syntax-highlighting)/' $HOME/.zshrc

# nodeライブラリインストール
COPY --chown=node:node package*.json ./
RUN npm ci