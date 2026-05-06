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
  return (
    <div className="[-webkit-app-region:drag] select-none h-10 w-full">
      タイトルバー（ここを掴んで移動）
    </div>
  );
}
