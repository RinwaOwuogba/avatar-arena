import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import { createNft, getAllNfts, getMyNfts } from "../../../utils/arena";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NftList = ({ arenaContract, name, ownNfts }) => {
  const navigate = useNavigate();
  const { performActions, address } = useContractKit();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      const allNfts = ownNfts
        ? await getMyNfts(arenaContract, address)
        : await getAllNfts(arenaContract);
      if (!allNfts) return;
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [arenaContract, address, ownNfts]);

  const addNft = async (data) => {
    try {
      setLoading(true);
      await createNft(arenaContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
      navigate("/my-nfts");
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
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

  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-5 fw-bold mb-0 text-muted">{name}</h1>

              <AddNfts save={addNft} address={address} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
              {nfts.map((_nft) => (
                <Nft
                  key={_nft.index}
                  nft={{
                    ..._nft,
                  }}
                  showBattle={ownNfts}
                  isOwner={address === _nft.owner}
                />
              ))}
              {nfts.length === 0 ? (
                <p className="w-100 text-center fw-light text-muted">
                  No NFTs to display. Why don't you mint some?
                </p>
              ) : null}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {
  arenaContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  arenaContract: null,
};

export default NftList;
