import React from "react";
import { Container } from "react-bootstrap";
import Nfts from "../components/arena/nfts";
import { useBalance, useArenaContract } from "../hooks";
import Header from "../components/header";

const MyNfts = () => {
  const { getBalance } = useBalance();
  const arenaContract = useArenaContract();

  return (
    <Container fluid="md">
      <Header />

      <main>
        <Nfts
          name="My NFT Collection"
          updateBalance={getBalance}
          arenaContract={arenaContract}
          ownNfts
        />
      </main>
    </Container>
  );
};

export default MyNfts;
