import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
  // getNfts,
  createNft,
  fetchNftContractOwner,
  getAllNfts,
} from "../../../utils/arena";
import { Row } from "react-bootstrap";

const NftList = ({ arenaContract, name }) => {
  const { performActions, address } = useContractKit();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nftOwner, setNftOwner] = useState(null);

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);
      const allNfts = [
        {
          index: 0,
          name: "Square",
          description: "Simple square",
          image:
            "https://ipfs.infura.io/ipfs/QmPS6iT9q1QwJT1NXMBcBKAPgFCiQqPzKq5SWqbTUFHnkF",
          owner: "0xF8B83E424e3194ABA851a2F3edE9Ca88CFf1eDB4",
        },
      ];
      // const allNfts = await getAllNfts(arenaContract);
      // if (!allNfts) return;
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [arenaContract]);

  const addNft = async (data) => {
    try {
      setLoading(true);
      await createNft(arenaContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };

  // const fetchContractOwner = useCallback(async (arenaContract) => {
  //   // get the address that deployed the NFT contract
  //   const _address = await fetchNftContractOwner(arenaContract);
  //   setNftOwner(_address);
  // }, []);

  useEffect(() => {
    try {
      if (address && arenaContract) {
        getAssets();
        // fetchContractOwner(arenaContract);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [arenaContract, address, getAssets]);
  // }, [arenaContract, address, getAssets, fetchContractOwner]);

  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-5 fw-bold mb-0 text-muted">{name}</h1>

              <AddNfts save={addNft} address={address} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {nfts.map((_nft) => (
                <Nft
                  key={_nft.index}
                  nft={{
                    ..._nft,
                  }}
                />
              ))}
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
