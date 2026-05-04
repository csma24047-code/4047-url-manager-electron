//tailwindcssv4.0
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

export function App() {
  return (
    //systemだとdocker上では認識できないのでdevtoolで Emulate CSS media feature prefers-color-schemeをdarkにして変わればOK
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ModeToggle />
    </ThemeProvider>
  );
}

export default App;
