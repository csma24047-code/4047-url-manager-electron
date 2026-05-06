import { X, Minus, Square } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function TitleBar() {
  const handleControl = (action: string) => {
    // Electronのメインプロセスに命令を送る (preload経由)
    window.electronAPI.send("window-control", action);
  };
  return (
    <div className="flex items-center justify-between bg-background border-b select-none">
      {/* ドラッグ可能エリア */}
      <div className="flex items-center flex-1 h-10 px-2 drag-region">
        <Menubar className="border-none bg-transparent no-drag">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => handleControl("close")}>
                Quit
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Undo</MenubarItem>
              <MenubarItem>Redo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <span className="ml-4 text-xs text-muted-foreground">
          My Awesome App
        </span>
      </div>

      {/* ウィンドウ操作ボタン (no-drag必須) */}
      <div className="flex no-drag">
        <button
          onClick={() => handleControl("minimize")}
          className="p-2 hover:bg-accent"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => handleControl("maximize")}
          className="p-2 hover:bg-accent"
        >
          <Square size={14} />
        </button>
        <button
          onClick={() => handleControl("close")}
          className="p-2 hover:bg-destructive hover:text-destructive-foreground"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
