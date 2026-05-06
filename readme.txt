wslgをインストール(画面表示用)
	xeyes
	で目玉が出るか確認ない場合は
	sudo apt update && sudo apt install x11-apps -y
	でインストール
	パスワードがわからない場合
		# WSLのデフォルトユーザーをroot（管理者）に切り替える
		wsl -u root

		# (Ubuntuが起動するので、そこでパスワードを上書き)
		passwd thepo

		# 新しいパスワードを2回入力（ここでも文字は見えません）
		exit
	devcontainer.jsonのmountsを設定
		// WSL内のパスを Windows側から見える形式（\\wsl.localhost\...）で指定
		"source=\\\\wsl.localhost\\Ubuntu\\mnt\\wslg,target=/mnt/wslg,type=bind",
		"source=\\\\wsl.localhost\\Ubuntu\\tmp\\.X11-unix,target=/tmp/.X11-unix,type=bind"
	npm run ~
	でUIがでたら成功

shadcn/ui
	入れ方
		components.jsonが設定ファイル
		@のエイリアスはtsconfig.jsonやelectron.vite.config.tsで設定
		@lib/utils.tsに自前で関数を用意(AI参照して作る)
		あとはコンポネントをDLしていくだけ

	コンポネントDL方法
		npx shadcn@latest add ～
		～にコンポネント名でインストール