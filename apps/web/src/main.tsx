import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@repo/ui/main.css";
import Loader from "./components/loader.tsx";
import { RecoilRoot } from "recoil";
import { Toaster } from "@ui/components/ui/toaster.tsx";
import { ThemeProvider } from "./components/providers/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RecoilRoot>
      <Suspense fallback={<Loader />}>
        <App />
        <Toaster />
      </Suspense>
    </RecoilRoot>
  </ThemeProvider>
);
