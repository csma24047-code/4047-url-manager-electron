import { X, Minus, Square } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/renderer/src/components/ui/menubar";
import { controlWindow } from "@/renderer/src/lib/electron";

export function TitleBar() {
  return (
    <div className="flex items-center justify-between bg-background border-b select-none">
      {/* ドラッグ可能エリア */}
      <div className="drag flex items-center flex-1 h-10 px-2">
        <Menubar className="no-drag border-none bg-transparent">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => controlWindow("close")}>
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
      <div className="no-drag flex">
        <button
          onClick={() => controlWindow("minimize")}
          className="p-2 hover:bg-accent"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => controlWindow("maximize")}
          className="p-2 hover:bg-accent"
        >
          <Square size={14} />
        </button>
        <button
          onClick={() => controlWindow("close")}
          className="p-2 hover:bg-destructive hover:text-destructive-foreground"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
