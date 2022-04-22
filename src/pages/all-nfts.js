import React from "react";
import { Container } from "react-bootstrap";
import Nfts from "../components/arena/nfts";
import { useBalance, useArenaContract } from "../hooks";
import Header from "../components/header";

const AllNfts = () => {
  const { getBalance } = useBalance();
  const arenaContract = useArenaContract();

  return (
    <Container fluid="md">
      <Header />

      <main>
        <Nfts
          name="All NFTs"
          updateBalance={getBalance}
          arenaContract={arenaContract}
        />
      </main>
    </Container>
  );
};

export default AllNfts;
