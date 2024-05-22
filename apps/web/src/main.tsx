import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@repo/ui/main.css";
import Loader from "./components/loader.tsx";
import { RecoilRoot } from "recoil";
import { Toaster } from "@ui/components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Suspense fallback={<Loader />}>
        <App />
        <Toaster />
      </Suspense>
    </RecoilRoot>
  </React.StrictMode>
);
