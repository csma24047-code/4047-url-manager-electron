VcxSrvをインストール(画面表示用)
vcxsrv-64.21.1.16.1.installer.exeをDL
Multiple windows→次に進んでいく→Disable access controlチェック→プライベートとプライバシーアクセスオン

	"containerEnv": {
		"DISPLAY": "host.docker.internal:0"
	}

でディスプレイを指定

package.json

