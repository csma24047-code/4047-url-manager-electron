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
<<<<<<< HEAD
=======
  const handleMouseDown = () => {
    (window as any).electronAPI.send("window-drag-start");

    // --- ここから修正 ---
    let ticking = false;

    const handleMouseMove = () => {
      if (!ticking) {
        // 次の描画タイミングまで実行を待機
        window.requestAnimationFrame(() => {
          (window as any).electronAPI.send("window-drag-move");
          ticking = false; // 実行が終わったらフラグを下ろす
        });
        ticking = true; // 待機中フラグを立てる
      }
    };
    // --- ここまで修正 ---

    const handleMouseUp = () => {
      (window as any).electronAPI.send("window-drag-end");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

>>>>>>> main
  return (
    <div className="[-webkit-app-region:drag] select-none h-10 w-full">
      タイトルバー（ここを掴んで移動）
    </div>
  );
}
