import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Route, Routes } from "react-router-dom";
import Cover from "./components/arena/Cover";
import "./App.css";
import { Notification } from "./components/ui/Notifications";
import coverImg from "./assets/img/nft_geo_cover.png";
import AllNfts from "./pages/all-nfts";
import MyNfts from "./pages/my-nfts";
import NewBattle from "./pages/new-battle";
import BattleResult from "./pages/battle-result";

const App = function AppWrapper() {
  const { address, connect } = useContractKit();

  return (
    <>
      <Notification />
      {address ? (
        <Routes>
          <Route path="/battle-result" element={<BattleResult />} />
          <Route path="/new-battle" element={<NewBattle />} />
          <Route path="/my-nfts" element={<MyNfts />} />
          <Route path="/all-nfts" element={<AllNfts />} />
          <Route path="*" element={<MyNfts />} />
        </Routes>
      ) : (
        <Cover name="GEO Collection" coverImg={coverImg} connect={connect} />
      )}
    </>
  );
};

export default App;
