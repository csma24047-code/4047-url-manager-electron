//tailwindcssv4.0
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

export function App() {
  return (
    //systemだとdocker上では認識できないのでdevtoolで Emulate CSS media feature prefers-color-schemeをdarkにして変わればOK
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Layout></Layout>
    </ThemeProvider>
  );
}

export function Layout() {
  return (
    <div className="h-screen w-full border">
      {/*画面全体*/}
      <ResizablePanelGroup orientation="horizontal">
        {/*左側パネル*/}
        <ResizablePanel defaultSize={5} minSize={150} maxSize={250}>
          <div className="flex h-full flex-col justify-between">
            <div className="p-2 rounded text-secondary-foreground whitespace-nowrap overflow-hidden text-ellipsis ">
              <h2 className="text-2xl font-bold mb-4">項目一覧</h2>
              <nav className="text-sm text-muted-foreground">
                <div className="p-1 rounded text-secondary-foreground">
                  すべてのアイテム
                </div>
                <div className="p-1 rounded text-secondary-foreground">
                  お気に入り
                </div>
                <div className="p-1 rounded text-secondary-foreground">
                  未整理
                </div>
              </nav>
            </div>
            {/* 下部：Configセクション */}
            <div className="p-2 rounded text-secondary-foreground whitespace-nowrap overflow-hidden text-ellipsis ">
              <button className="flex w-full items-center gap-2 p-2 text-sm hover:bg-accent rounded-md transition-colors">
                <span className="whitespace-nowrap font-bold">設定</span>
                <ModeToggle />
              </button>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-px bg-border hover:bg-primary transition-colors" />

        {/*右側パネル*/}
        <ResizablePanel defaultSize={80}>
          <ScrollArea className="h-full p-6">
            <h1 className="text-2xl font-bold mb-6">アイテムリスト</h1>

            {/* ここにカード（グリッド）を並べる */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 実際のURLカードコンポーネントをここに配置 */}
              <div className="aspect-video border rounded-lg p-4 bg-card">
                URLの内容...
              </div>
              <div className="aspect-video border rounded-lg p-4 bg-card">
                URLの内容...
              </div>
              <div className="aspect-video border rounded-lg p-4 bg-card">
                URLの内容...
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle className="w-px bg-border hover:bg-primary transition-colors" />

        {/*右側パネル*/}
        <ResizablePanel defaultSize={80}>
          <ScrollArea className="h-full p-6">
            <h1 className="text-2xl font-bold mb-6">詳細</h1>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
