import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "./components/party/player";
import Layout from "./components/layout";
import PartyLayout from "./components/party/party-layout";
import Landing from "./components/landing/landing";
import { WebSocketProvider } from "./components/providers/wsContext";
function App() {
  return (
    <>
      <BrowserRouter>
        <WebSocketProvider>
          <Routes>
            <Route path="/" element={<Layout children={<Landing />} />} />
            <Route
              path="/party/:partyId"
              element={<PartyLayout children={<Player />} />}
            />
          </Routes>
        </WebSocketProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
