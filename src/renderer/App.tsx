//tailwindcssv4.0
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
//自作
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { TitleBar } from "@/components/TitleBar";

export function App() {
  const handleMouseDown = () => {
    (window as any).electronAPI.send("window-drag-start");

    // マウスを動かしている間と、離した時のイベントを登録
    const handleMouseMove = () => {
      (window as any).electronAPI.send("window-drag-move");
    };

    const handleMouseUp = () => {
      (window as any).electronAPI.send("window-drag-end");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#1a1a1a",
        color: "white",
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          height: "100px",
          width: "100%",
          background: "#ff4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "move",
          userSelect: "none",
        }}
      >
        ここを掴んで自由に動かして！
      </div>
    </div>
  );
}
