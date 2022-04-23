import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useArenaContract } from "../hooks";
import Header from "../components/header";
import Loader from "../components/ui/Loader";
import { fetchLatestBattle } from "../utils/arena";
import { Link } from "react-router-dom";
import Versus from "../components/arena/nfts/versus";

const BattleResult = () => {
  const arenaContract = useArenaContract();
  const { address } = useContractKit();
  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState(null);

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
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [arenaContract, address]);

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
              {battle ? (
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
                </>
              ) : (
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
              )}
            </Container>
          </>
        ) : (
          <Loader />
        )}
      </main>
    </Container>
  );
};

export default BattleResult;

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
