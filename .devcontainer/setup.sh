#!/bin/bash

# エラーが発生したらその時点でスクリプトを中断する（安全対策）
set -e

echo "==> zshプラグインのインストールを開始します..."

# Oh My Zshのカスタムディレクトリのパスを設定（未定義ならデフォルト値）
ZSH_CUSTOM_DIR="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"

# 各種プラグイン用のディレクトリを作成（すでにある場合はスキップ）
mkdir -p "$ZSH_CUSTOM_DIR/plugins"

# 1. zsh-autosuggestions のクローン
if [ ! -d "$ZSH_CUSTOM_DIR/plugins/zsh-autosuggestions" ]; then
    git clone https://github.com/zsh-users/zsh-autosuggestions "$ZSH_CUSTOM_DIR/plugins/zsh-autosuggestions"
else
    echo "zsh-autosuggestions は既にインストールされています。"
fi

# 2. zsh-syntax-highlighting のクローン
if [ ! -d "$ZSH_CUSTOM_DIR/plugins/zsh-syntax-highlighting" ]; then
    git clone https://github.com/zsh-users/zsh-syntax-highlighting "$ZSH_CUSTOM_DIR/plugins/zsh-syntax-highlighting"
else
    echo "zsh-syntax-highlighting は既にインストールされています。"
fi

# 3. zsh-completions のクローン
if [ ! -d "$ZSH_CUSTOM_DIR/plugins/zsh-completions" ]; then
    git clone https://github.com/zsh-users/zsh-completions "$ZSH_CUSTOM_DIR/plugins/zsh-completions"
else
    echo "zsh-completions は既にインストールされています。"
fi

# 4. .zshrc の書き換え（plugins=(git) を新しいプラグインリストに置換）
# ※ Linux(devcontainer)環境で確実に動く形式にしています
if [ -f "$HOME/.zshrc" ]; then
    echo "==> .zshrc のプラグイン設定を更新します..."
    sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-completions zsh-syntax-highlighting)/' "$HOME/.zshrc"
else
    echo "警告: .zshrc が見つからないため、プラグインの有効化をスキップしました。"
fi

# 5. node_modules のシンボリックリンク作成
echo "==> node_modules のシンボリックリンクを作成します..."
# リンク先がすでに存在する場合は削除して作り直す（エラー防止のために -f を付与）
ln -sfn /workspace/node_modules /workspaces/url-manager-electron/node_modules

echo "==> すべてのセットアップが完了しました！"