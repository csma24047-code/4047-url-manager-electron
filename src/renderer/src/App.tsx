import { useEffect, useState } from "react";
import { Trash2, Search } from "lucide-react"; // ★ Search アイコンを追加

// reactコンポーネント
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/renderer/src/components/ui/resizable";
import { ScrollArea } from "@/renderer/src/components/ui/scroll-area";
import { ThemeProvider } from "@/renderer/src/components/theme-provider";
import { TitleBar } from "@/renderer/src/components/title-bar";
import { ModeToggle } from "@/renderer/src/components/mode-toggle";
import { AddUrlDialog } from "@/renderer/src/components/add-url-dialog";
import { toast } from "sonner"; // ★大元のパッケージから直接インポート（ここにtoast関数が入っている）
import { Toaster } from "@/renderer/src/components/ui/sonner"; // ★提示していただいた自前のコンポーネント

// urlの型定義
import { URLItem } from "@/types";

// ナビゲーションの型定義
type FilterTab = "all" | "favorite" | "uncategorized" | string;

export function App() {
  // 取得したURLリストを管理するステート
  const [urls, setUrls] = useState<URLItem[]>([]);

  // ★ 検索・絞り込み用のステートを追加
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // アプリ起動時にデータを1回だけ読み込む
  useEffect(() => {
    window.electronAPI.loadData().then((data) => {
      if (data && data.urls) {
        setUrls(data.urls);
      }
    });
  }, []);

  // 追加ボタンが押されたときの処理
  const handleAddItem = (newItem: URLItem) => {
    setUrls([...urls, newItem]);
  };

  const handleDelete = async (id: number) => {
    const res = await window.electronAPI.deleteUrl(id);
    if (res.success) {
      setUrls(urls.filter((item) => item.id !== id));
      // ★ 追加：今詳細を開いているアイテムが消されたら、詳細の選択を解除する
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  // ★追加：選択中のアイテムを管理
  const [selectedItem, setSelectedItem] = useState<URLItem | null>(null);

  // ★追加：編集用フォームのステート
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editTags, setEditTags] = useState("");

  // アイテムが選択されたらフォームに値をセットする
  const handleSelectCard = (item: URLItem) => {
    setSelectedItem(item);
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditTags(item.tags.join(", "));
  };

  // ★追加：編集内容を保存する処理
  const handleUpdate = async () => {
    if (!selectedItem) return;

    const updatedItem: URLItem = {
      ...selectedItem,
      title: editTitle,
      url: editUrl,
      tags: editTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    };

    // @ts-ignore (型定義をスキップする場合)
    const res = await window.electronAPI.updateUrl(updatedItem);
    if (res.success) {
      // 画面上のリストを更新
      setUrls(
        urls.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
      setSelectedItem(updatedItem);
      toast.success("更新完了", {
        description: "アイテムの情報を更新しました。",
      });
    }
  };

  // ★ 重複のない全タグのリストを自動生成（左ペインに動的表示するため）
  const allTags = Array.from(new Set(urls.flatMap((item) => item.tags)));

  // ★ フィルタリング＆検索のロジック
  const filteredUrls = urls.filter((item) => {
    // 1. タブ/カテゴリによる絞り込み
    if (activeTab === "favorite") {
      // 現状URLItemにfavorite属性がないため、ここではデモとして「お気に入り」タグが含まれるものを対象にします
      if (!item.tags.includes("お気に入り")) return false;
    } else if (activeTab === "uncategorized") {
      if (item.tags.length > 0) return false;
    } else if (activeTab !== "all") {
      // 個別のタグが選択されている場合
      if (!item.tags.includes(activeTab)) return false;
    }

    // 2. 検索キーワードによる絞り込み（タイトルまたはURLにマッチ）
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {/* 画面全体を覆うFlexコンテナ */}
      <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
        {/* 上部：カスタムタイトルバー */}
        <TitleBar />

        {/* 下部：メインコンテンツエリア（3ペイン） */}
        <div className="flex-1 w-full min-h-0">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            {/* 1. 左側パネル：ナビゲーション (12%に少し拡張) */}
            <ResizablePanel defaultSize="12%" minSize="10%" maxSize="20%">
              <div className="flex h-full flex-col justify-between p-2">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <h2 className="text-2xl font-bold mb-4 px-1">項目一覧</h2>
                  <nav className="text-sm text-muted-foreground space-y-1 mb-6">
                    <div
                      onClick={() => setActiveTab("all")}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        activeTab === "all"
                          ? "bg-accent text-accent-foreground font-bold"
                          : "text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      すべてのアイテム
                    </div>
                    <div
                      onClick={() => setActiveTab("favorite")}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        activeTab === "favorite"
                          ? "bg-accent text-accent-foreground font-bold"
                          : "text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      お気に入り
                    </div>
                    <div
                      onClick={() => setActiveTab("uncategorized")}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        activeTab === "uncategorized"
                          ? "bg-accent text-accent-foreground font-bold"
                          : "text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      未整理
                    </div>
                  </nav>

                  {/* ★ 登録されているタグの一覧を動的に表示 */}
                  {allTags.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-muted-foreground px-1 mb-2">
                        タグで絞り込み
                      </h3>
                      <ScrollArea className="h-40 border rounded-md p-1 bg-card/50">
                        {allTags.map((tag) => (
                          <div
                            key={tag}
                            onClick={() => setActiveTab(tag)}
                            className={`p-1.5 text-xs rounded cursor-pointer transition-colors truncate ${
                              activeTab === tag
                                ? "bg-primary text-primary-foreground font-bold"
                                : "text-secondary-foreground hover:bg-accent"
                            }`}
                          >
                            # {tag}
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}

                  <AddUrlDialog onAdd={handleAddItem}>
                    <button className="w-full bg-primary text-primary-foreground text-sm font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors cursor-pointer">
                      + 新しいURLを追加
                    </button>
                  </AddUrlDialog>
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

            {/* 2. 中央パネル：URLアイテムリスト (48%) */}
            <ResizablePanel defaultSize="48%">
              <div className="flex flex-col h-full p-6">
                <div className="flex flex-col gap-4 mb-6 shrink-0">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                      {activeTab === "all" && "すべてのアイテム"}
                      {activeTab === "favorite" && "お気に入り"}
                      {activeTab === "uncategorized" && "未整理"}
                      {!["all", "favorite", "uncategorized"].includes(
                        activeTab,
                      ) && `# ${activeTab}`}
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({filteredUrls.length} 件)
                      </span>
                    </h1>
                    {activeTab !== "all" && (
                      <button
                        onClick={() => setActiveTab("all")}
                        className="text-xs text-muted-foreground hover:text-primary underline"
                      >
                        フィルターをクリア
                      </button>
                    )}
                  </div>

                  {/* ★ 検索バー（インプットコンポーネント）の配置 */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <input
                      type="text"
                      placeholder="タイトルまたはURLで検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-card px-9 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {/* スクロールエリア（検索結果を表示） */}
                <div className="flex-1 min-h-0">
                  <ScrollArea className="h-full">
                    {filteredUrls.length === 0 ? (
                      <div className="text-center py-12 text-sm text-muted-foreground">
                        該当するアイテムが見つかりませんでした。
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                        {filteredUrls.map((item) => (
                          // 既存の grid 内の card の div を以下のように変更
                          <div
                            key={item.id}
                            onClick={() => handleSelectCard(item)} // ★追加
                            className={`border rounded-lg p-4 bg-card shadow-xs flex flex-col justify-between h-32 relative group cursor-pointer hover:border-primary transition-colors ${
                              selectedItem?.id === item.id
                                ? "ring-2 ring-primary"
                                : "" // ★選択中のハイライト
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // ★ 親のカードクリックイベント（詳細表示）が発動するのを防ぐ
                                handleDelete(item.id);
                              }}
                              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive rounded hover:bg-accent transition-colors z-10" // ★z-10も足しておくとクリックしやすくなります
                              title="削除"
                            >
                              <Trash2 size={16} />
                            </button>

                            <div>
                              <h3 className="font-bold text-lg truncate pr-6">
                                {item.title}
                              </h3>
                              <p
                                onClick={() =>
                                  window.electronAPI.openInBrowser(item.url)
                                }
                                className="text-xs text-blue-500 hover:underline truncate mb-2 cursor-pointer inline-block max-w-full"
                                title="ブラウザで開く"
                              >
                                {item.url}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  onClick={(e) => {
                                    e.stopPropagation(); // 親カードのクリックイベント等を防ぐ
                                    setActiveTab(tag); // タグをクリックした際にも直接絞り込める
                                  }}
                                  className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-px bg-border hover:bg-primary transition-colors" />

            {/* 3. 右側パネル：詳細表示 */}
            {/* 3. 右側パネル：詳細表示 */}
            <ResizablePanel defaultSize="40%" minSize="20%">
              <ScrollArea className="h-full p-6">
                <h1 className="text-2xl font-bold mb-6">
                  アイテムの詳細・編集
                </h1>

                {!selectedItem ? (
                  <p className="text-sm text-muted-foreground">
                    リストで選択されたアイテムの詳細情報がここに表示されます。
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">
                        タイトル
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">
                        URL
                      </label>
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">
                        タグ (カンマ区切り)
                      </label>
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs"
                        placeholder="例: 仕事, あとで読む"
                      />
                    </div>
                    <button
                      onClick={handleUpdate}
                      className="w-full bg-primary text-primary-foreground text-sm font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors mt-4 cursor-pointer"
                    >
                      変更を保存する
                    </button>
                  </div>
                )}
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
