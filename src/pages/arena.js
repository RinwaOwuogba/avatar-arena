import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import Nfts from "../components/arena/nfts";
import { useBalance, useArenaContract } from "../hooks";
import Header from "../components/header";

import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Nft from "../components/arena/nfts/Card";
import Loader from "../components/ui/Loader";
import {
  NotificationSuccess,
  NotificationError,
} from "../components/ui/Notifications";
import {
  // getNfts,
  createNft,
  fetchLatestBattle,
  fetchNft,
  fetchNftContractOwner,
  getAllNfts,
  getMyNfts,
  startBattle,
} from "../utils/arena";
import { Link, useParams } from "react-router-dom";
import Versus from "../components/arena/nfts/versus";
import "./arena.css";

const Arena = () => {
  const { address } = useContractKit();
  const { getBalance } = useBalance();
  const arenaContract = useArenaContract();

  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);
  //   const [selectedNft, setSelectedNft] = useState({
  //     index: "0",
  //     owner: "0xF8B83E424e3194ABA851a2F3edE9Ca88CFf1eDB4",
  //     wins: "0",
  //     name: "Test",
  //     image:
  //       "https://ipfs.infura.io/ipfs/QmX5umgYsTJWGuFLRW2M34yjzTuofYyy32bdvx2orFvo8t",
  //     description: "NFT Prima",
  //   });

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(window.location.search);
      const tokenId = params.get("tokenId");

      const latestBattle = await fetchLatestBattle(arenaContract);
      setBattle(latestBattle);

      if (tokenId) {
        const nft = await fetchNft(arenaContract, tokenId);

        setSelectedNft(nft);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [arenaContract, address]);

  const newBattle = async () => {
    try {
      setLoading(true);
      await startBattle(arenaContract, selectedNft.index);
      toast(<NotificationSuccess text="Fetching latest battle.." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to start a battle." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      if (address && arenaContract) {
        getAssets();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [arenaContract, address, getAssets]);

  if (!address) return null;

  return (
    <Container fluid="md">
      <Header />

      <main>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-5 fw-bold mb-0 text-muted">Arena</h1>
            </div>

            <Container className="bg-light p-3 mb-5 battleContainer">
              {selectedNft ? (
                <>
                  <Versus nft1={selectedNft} />

                  <Row className="mt-5">
                    <Col className="d-flex justify-content-center">
                      <Button
                        onClick={newBattle}
                        variant="outline-danger"
                        className="px-5"
                      >
                        Start battle
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : null}

              {!selectedNft ? (
                <>
                  {!battle ? (
                    <Row>
                      <p className="text-center py-3 text-muted fw-bold">
                        No battles yet
                      </p>
                    </Row>
                  ) : null}

                  {battle ? (
                    <>
                      <Versus
                        nft1={battle.players[0].nft}
                        nft2={battle.players[1].nft}
                      />

                      <Row>Battle Time: {battle.createdAt.toString()}</Row>
                      <Row>
                        {battle.winner === 0
                          ? "Waiting for opponent to start battle.."
                          : battle.winner === address
                          ? "You WON!"
                          : "You LOST!"}
                      </Row>
                    </>
                  ) : null}
                  <Row className="mt-5">
                    <Col className="d-flex justify-content-center">
                      <Link to="/my-nfts">
                        <Button variant="outline-danger" className="px-5">
                          Choose avatar for new battle
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </>
              ) : null}
            </Container>
          </>
        ) : (
          <Loader />
        )}
      </main>
    </Container>
  );
};

export default Arena;

{
  /* <Row className="mt-5">
                        <Col className="d-flex justify-content-center">
                          <Link to="/my-nfts">
                            <Button variant="outline-danger" className="px-5">
                              Choose avatar for new battle
                            </Button>
                          </Link>
                        </Col>
                      </Row> */
}
{
  /* <Row>
                        <Col xs={5}>
                          <Nft
                            key={battle.players[0].nft.index}
                            nft={{
                              ...battle.players[0].nft,
                            }}
                          />
                        </Col>
                        <Col
                          xs={2}
                          className="d-flex align-items-center justify-content-center fw-bold text-uppercase fs-4"
                        >
                          vs
                        </Col>
                        <Col xs={5}>
                          {battle.players[1].nft.indexbattle.players[1].nft ? (
                            <Nft
                              key={battle.players[1].nft.index}
                              nft={{
                                ...battle.players[1].nft.indexbattle.players[1]
                                  .nft,
                              }}
                            />
                          ) : (
                            <div className="bg-dark bg-gradient h-100"></div>
                          )}
                        </Col>
                      </Row> */
}
