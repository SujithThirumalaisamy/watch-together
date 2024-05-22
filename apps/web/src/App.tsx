import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "./components/party/player";
import Layout from "./components/layout";
import PartyLayout from "./components/party/party-layout";
import Landing from "./components/landing/landing";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout children={<Landing />} />} />
          <Route
            path="/party/:partyId"
            element={<PartyLayout children={<Player />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
