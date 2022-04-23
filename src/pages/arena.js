import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useArenaContract } from "../hooks";
import Header from "../components/header";
import { toast } from "react-toastify";
import Loader from "../components/ui/Loader";
import {
  NotificationSuccess,
  NotificationError,
} from "../components/ui/Notifications";
import {
  fetchLatestBattle,
  fetchNft,
  isTokenIdValid,
  startBattle,
} from "../utils/arena";
import { Link, useLocation, useParams } from "react-router-dom";
import Versus from "../components/arena/nfts/versus";
import "./arena.css";

const Arena = () => {
  const location = useLocation();
  const { performActions, address } = useContractKit();
  const arenaContract = useArenaContract();

  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);

  const params = new URLSearchParams(location.search);
  const tokenId = params.get("tokenId");

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
      const latestBattle = await fetchLatestBattle(arenaContract);
      setBattle(latestBattle);

      if (tokenId) {
        const validId = await isTokenIdValid(arenaContract, tokenId);

        if (validId) {
          const nft = await fetchNft(arenaContract, tokenId);
          setSelectedNft(nft);
        } else {
          return toast(<NotificationError text="Invalid avatar ID." />);
        }
      } else {
        setSelectedNft(null);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [arenaContract, address, tokenId]);

  const newBattle = async () => {
    try {
      setLoading(true);
      await startBattle(arenaContract, performActions, selectedNft.index);
      toast(<NotificationSuccess text="Fetching latest battle.." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to start battle." />);
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
  }, [arenaContract, address, getAssets, tokenId]);

  if (!address) return null;

  const sections = {
    existingBattle: "existingBattle",
    newBattle: "newBattle",
  };

  const getBattleToRender = (battle, selectedNft) => {
    if (battle && !battle.winner) return sections.existingBattle;

    if (battle && battle.winner && !selectedNft) return sections.existingBattle;

    if (battle && battle.winner && selectedNft) return sections.newBattle;

    if (selectedNft) return sections.newBattle;

    return "";
  };

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
              {getBattleToRender(battle, selectedNft) ==
              sections.existingBattle ? (
                <>
                  <Versus
                    nft1={battle.players[0].nft}
                    nft2={battle.players[1].nft}
                  />

                  <Row className="px-3 pt-5 fw-bold">
                    Battle Time: {battle.createdAt.toString()}
                  </Row>
                  <Row className="px-3 pt-2">
                    {!battle.winner ? (
                      <p className="w-100 text-center text-muted">
                        Waiting for opponent to join battle..
                      </p>
                    ) : battle.winner === address ? (
                      <p className="w-100 text-center fw-bold fs-3 text-success">
                        You WON!
                      </p>
                    ) : (
                      <p className="w-100 text-center fw-bold fs-3 text-danger">
                        You LOST!
                      </p>
                    )}
                  </Row>

                  {battle.winner ? (
                    <Row className="mt-4">
                      <Col className="d-flex justify-content-center">
                        <Link to="/my-nfts">
                          <Button variant="outline-danger" className="px-5">
                            Choose avatar for new battle
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  ) : null}
                </>
              ) : null}

              {getBattleToRender(battle, selectedNft) == sections.newBattle ? (
                <>
                  <Versus nft1={selectedNft} />

                  <Row className="mt-4">
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

              {getBattleToRender(battle, selectedNft) == "" ? (
                <>
                  <Row>
                    <p className="text-center py-3 text-muted fw-bold">
                      You haven't participated in any battles yet
                    </p>
                  </Row>

                  <Row className="mt-4">
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
