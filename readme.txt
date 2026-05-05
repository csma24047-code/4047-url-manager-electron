VcxSrvをインストール(画面表示用)
	vcxsrv-64.21.1.16.1.installer.exeをDL
	Multiple windows→次に進んでいく→Disable access controlチェック→プライベートとプライバシーアクセスオン
		"containerEnv": {
			"DISPLAY": "host.docker.internal:0"
		}
	でディスプレイを指定

shadcn/ui
	入れ方
		components.jsonが設定ファイル
		@のエイリアスはtsconfig.jsonやelectron.vite.config.tsで設定
		@lib/utils.tsに自前で関数を用意(AI参照して作る)
		あとはコンポネントをDLしていくだけ

	コンポネントDL方法
		npx shadcn@latest add ～
		～にコンポネント名でインストール