//tailwindcssv4.0
import { ThemeProvider } from "@/renderer/src/components/theme-provider";
import { TitleBar } from "@/renderer/src/components/title-bar";
import { mainContents } from "@/renderer/src/components/main-contents";
import { Button } from "@/renderer/src/components/ui/button";

export function App() {
  return (
    <div className="flex flex-col gap-4 p-8">
      {/* 1. 標準的なshadcnボタン（これで色が変わるか確認） */}
      <Button variant="default">標準ボタン</Button>

      {/* 2. 破壊的アクション用の赤いボタン（bg-destructive） */}
      <Button variant="destructive">削除ボタン</Button>

      {/* 3. drag領域に入れた場合（今回の問題の切り分け） */}
      <div className="drag p-4 bg-gray-100">
        <Button variant="outline" className="no-drag">
          ドラッグ領域内のボタン
        </Button>
      </div>
    </div>
  );
}
