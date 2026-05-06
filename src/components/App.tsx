//tailwindcssv4.0
import { ThemeProvider } from "@/components/theme-provider";
import { TitleBar } from "@/components/title-bar";
import { mainContents } from "@/components/main-contents";

export function App() {
  return (
    <button
      style={
        {
          width: "100%",
          height: "40px",
          background: "red",
          WebkitAppRegion: "drag", // JS側からも直接指定
        } as any
      }
    >
      test
    </button>
  );
}
