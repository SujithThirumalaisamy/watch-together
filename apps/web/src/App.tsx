import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "./components/party/player";
import Layout from "./components/layout";
import PartyLayout from "./components/party/party-layout";
import Landing from "./components/landing/landing";
import { WebSocketProvider } from "./components/providers/wsContext";
import Login from "./components/auth/login";
import { useUser } from "./components/providers/user-provider";
function App() {
  const user = useUser();
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
            <Route path="/login" element={<Login />} />
          </Routes>
        </WebSocketProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
