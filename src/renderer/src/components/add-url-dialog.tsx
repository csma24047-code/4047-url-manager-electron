import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/src/components/ui/dialog";
import { URLItem } from "@/types";

interface AddUrlDialogProps {
  onAdd: (newItem: URLItem) => void;
  // 左ペインのボタンをここに流し込めるように、子要素（ボタン）をTriggerとして受け取る
  children: React.ReactNode;
}

export function AddUrlDialog({ onAdd, children }: AddUrlDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tagsString, setTagsString] = useState(""); // カンマ区切り用の文字列

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !url) return;

    // カンマ区切りの文字列を配列に変換（前後の空白を削除し、空文字を除外）
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newItem: URLItem = {
      id: Date.now(),
      title,
      url,
      tags,
      addedAt: new Date().toISOString().split("T")[0] || "",
    };

    // メインプロセス経由で json に保存
    const res = await window.electronAPI.saveUrl(newItem);

    if (res.success) {
      onAdd(newItem); // 親（App.tsx）のステートを更新
      // フォームをリセットして閉じる
      setTitle("");
      setUrl("");
      setTagsString("");
      setOpen(false);
    } else {
      alert("保存に失敗しました: " + res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>新しいアイテムを追加</DialogTitle>
          <DialogDescription>
            保存したいWebサイトの情報を入力してください。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Google"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://google.com"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              タグ{" "}
              <span className="text-xs text-muted-foreground">
                （カンマ「,」区切り）
              </span>
            </label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="search, work, google"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DialogFooter className="pt-2">
            <button
              type="submit"
              className="bg-primary text-primary-foreground text-sm font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors"
            >
              追加する
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
