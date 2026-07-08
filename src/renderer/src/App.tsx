import { useEffect, useState } from "react"; // ★ useEffect, useState を追加
import { Trash2 } from "lucide-react";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/renderer/src/components/ui/resizable";
import { ScrollArea } from "@/renderer/src/components/ui/scroll-area";
import { ThemeProvider } from "@/renderer/src/components/theme-provider";
import { TitleBar } from "@/renderer/src/components/title-bar";
import { ModeToggle } from "@/renderer/src/components/mode-toggle";

// ★ ラッパーファイルから明示的に import する
import {
  loadAppData,
  saveNewUrl,
  deleteUrlById,
} from "@/renderer/src/lib/electron";

// URLアイテムの型定義
interface URLItem {
  id: number;
  title: string;
  url: string;
  tags: string[];
  addedAt: string;
}

export function App() {
  // ★ 取得したURLリストを管理するステート
  const [urls, setUrls] = useState<URLItem[]>([]);

  // ★ アプリ起動時にデータを1回だけ読み込む
  useEffect(() => {
    loadAppData().then((data) => {
      if (data && data.urls) {
        setUrls(data.urls);
      }
    });
  }, []);

  // ★ 追加ボタンが押されたときの処理
  const handleAddDummy = async () => {
    const newItem: URLItem = {
      id: Date.now(),
      title: `テストサイト-${urls.length + 1}`,
      url: "https://example.com",
      tags: ["test", "new"],
      // ★ 末尾に || "" を足して、絶対に string 型になるようにする
      addedAt: new Date().toISOString().split("T")[0] || "",
    };

    const res = await saveNewUrl(newItem);
    if (res.success) {
      // 画面側のステートも更新して、再読み込みなしで即座に反映させる
      setUrls([...urls, newItem]);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteUrlById(id);
    if (res.success) {
      // 画面側のステートからも即座に消去する
      setUrls(urls.filter((item) => item.id !== id));
    }
  };

  return (
    //systemだとdocker上では認識できないのでdevtoolで Emulate CSS media feature prefers-color-schemeをdarkにして変わればOK
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {/* 画面全体を覆うFlexコンテナ */}
      <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
        {/* 上部：カスタムタイトルバー */}
        <TitleBar />

        {/* 下部：メインコンテンツエリア（3ペイン） */}
        <div className="flex-1 w-full min-h-0">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            {/* 1. 左側パネル：ナビゲーション (10%) */}
            <ResizablePanel defaultSize="10%" minSize="5%" maxSize="15%">
              <div className="flex h-full flex-col justify-between p-2">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <h2 className="text-2xl font-bold mb-4 px-1">項目一覧</h2>
                  <nav className="text-sm text-muted-foreground space-y-1">
                    <div className="p-2 rounded text-secondary-foreground cursor-pointer hover:bg-accent transition-colors">
                      すべてのアイテム
                    </div>
                    <div className="p-2 rounded text-secondary-foreground cursor-pointer hover:bg-accent transition-colors">
                      お気に入り
                    </div>
                    <div className="p-2 rounded text-secondary-foreground cursor-pointer hover:bg-accent transition-colors">
                      未整理
                    </div>
                  </nav>

                  {/* ★ テスト用の追加ボタンを設置 */}
                  <button
                    onClick={handleAddDummy}
                    className="w-full bg-primary text-primary-foreground text-sm font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors"
                  >
                    + ダミーURLを追加
                  </button>
                </div>

                {/* 左下：設定＆テーマ切り替え */}
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <div className="flex w-full items-center justify-between gap-2 p-2 text-sm hover:bg-accent rounded-md transition-colors cursor-pointer">
                    <span className="font-bold">設定</span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </ResizablePanel>

            {/* 開閉・リサイズ用ハンドル */}
            <ResizableHandle className="w-px bg-border hover:bg-primary transition-colors" />

            {/* 2. 中央パネル：URLアイテムリスト (50%) */}
            <ResizablePanel defaultSize="50%">
              <ScrollArea className="h-full p-6">
                <h1 className="text-2xl font-bold mb-6">アイテムリスト</h1>

                {/* ★ JSONから読み込んだURLデータでカードを動的生成 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {urls.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-card shadow-xs flex flex-col justify-between h-32 relative group"
                    >
                      {/* ★ カードの右上に削除ボタンを配置（マウスホバー時だけ目立たせる） */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive rounded hover:bg-accent transition-colors"
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div>
                        {/* 削除ボタンと被らないように横幅に pr-6 を指定 */}
                        <h3 className="font-bold text-lg truncate pr-6">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mb-2">
                          {item.url}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle className="w-px bg-border hover:bg-primary transition-colors" />

            {/* 3. 右側パネル：詳細表示 */}
            <ResizablePanel defaultSize="40%" minSize="20%">
              <ScrollArea className="h-full p-6">
                <h1 className="text-2xl font-bold mb-6">詳細</h1>
                <p className="text-sm text-muted-foreground">
                  リストで選択されたアイテムの詳細情報がここに表示されます。
                </p>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ThemeProvider>
  );
}
