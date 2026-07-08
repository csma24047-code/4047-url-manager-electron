import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/renderer/src/components/ui/resizable";
import { ScrollArea } from "@/renderer/src/components/ui/scroll-area";
import { ThemeProvider } from "@/renderer/src/components/theme-provider";
import { TitleBar } from "@/renderer/src/components/title-bar";
import { ModeToggle } from "@/renderer/src/components/mode-toggle";

export function App() {
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

                {/* URLカードのグリッド配置 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="aspect-video border rounded-lg p-4 bg-card shadow-xs">
                    URLの内容...
                  </div>
                  <div className="aspect-video border rounded-lg p-4 bg-card shadow-xs">
                    URLの内容...
                  </div>
                  <div className="aspect-video border rounded-lg p-4 bg-card shadow-xs">
                    URLの内容...
                  </div>
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle className="w-px bg-border hover:bg-primary transition-colors" />

            {/* 3. 右側パネル：詳細表示 (40%) */}
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
