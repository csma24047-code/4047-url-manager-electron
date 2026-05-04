// shadcn/ui からコンポーネントをインポート
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DebugPage() {
  return (
    // 親要素に dark クラスを付与
    <div className="dark">
      {/*
         Tailwind v4 の新記法:
         bg-[color:var(--background)]  => bg-(--background)
         text-[color:var(--foreground)] => text-(--foreground)
      */}
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-(--background) text-(--foreground)">
        <div className="rounded-lg border border-(--border) bg-(--card) p-8 shadow-lg">
          <h1 className="text-2xl font-bold">V4 ダークモード・デバッグ</h1>
          <p className="mt-2 text-(--muted-foreground)">
            背景が黒、この枠が濃いグレーなら CSS 変数は生きています。
          </p>

          <button className="mt-4 rounded bg-(--primary) px-4 py-2 text-(--primary-foreground)">
            ボタンの色を確認
          </button>
        </div>

        {/* 比較用：ライトモード固定エリア */}
        <div className="light bg-white p-4 text-black ring-1 ring-slate-200">
          <p>ここは常にライトモード（白背景）</p>
        </div>
      </div>
    </div>
  );
}
