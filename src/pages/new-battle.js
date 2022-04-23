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
import { fetchNft, isTokenIdValid, startBattle } from "../utils/arena";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Versus from "../components/arena/nfts/versus";

const NewBattle = () => {
  const { performActions, address } = useContractKit();
  const arenaContract = useArenaContract();

  const [loading, setLoading] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tokenId = params.get("tokenId");

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

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
      toast(<NotificationSuccess text="Fetching battle results.." />);
      setTimeout(() => {
        navigate("/battle-result");
      }, 2000);
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

  return (
    <Container fluid="md">
      <Header />

      <main>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-5 fw-bold mb-0 text-muted">New battle</h1>
            </div>

            <Container className="bg-light p-3 mb-5 battleContainer">
              {selectedNft ? (
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

              {!selectedNft ? (
                <>
                  <Row>
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

export default NewBattle;
