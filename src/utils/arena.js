import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const createNft = async (
  arenaContract,
  performActions,
  { name, description, ipfsImage, ownerAddress }
) => {
  await performActions(async (kit) => {
    if (!name || !description || !ipfsImage) return;
    const { defaultAccount } = kit;

    // convert NFT metadata to JSON format
    const data = JSON.stringify({
      name,
      description,
      image: ipfsImage,
      owner: defaultAccount,
    });

    try {
      // save NFT metadata to IPFS
      const added = await client.add(data);

      // IPFS url for uploaded metadata
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      // mint the NFT and save the IPFS url to the blockchain
      let transaction = await arenaContract.methods
        .safeMint(ownerAddress, url)
        .send({ from: defaultAccount });

      return transaction;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};

export const uploadToIpfs = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

const getNft = (arenaContract, tokenId) =>
  new Promise(async (resolve) => {
    const tokenUri = await arenaContract.methods.tokenURI(tokenId).call();
    const wins = await arenaContract.methods.getAvatarWins(tokenId).call();
    const meta = await fetchNftMeta(tokenUri);
    const owner = await fetchNftOwner(arenaContract, tokenId);
    resolve({
      index: tokenId,
      owner,
      wins,
      name: meta.data.name,
      image: meta.data.image,
      description: meta.data.description,
    });
  });

export const getAllNfts = async (arenaContract) => {
  try {
    const nfts = [];
    const nftsLength = await arenaContract.methods.totalSupply().call();
    for (let i = 0; i < Number(nftsLength); i++) {
      const nft = getNft(arenaContract, i);
      nfts.push(nft);
    }
    return Promise.all(nfts);
  } catch (e) {
    console.log({ e });
  }
};

export const getMyNfts = async (arenaContract, ownerAddress) => {
  try {
    const userTokensLength = await arenaContract.methods
      .balanceOf(ownerAddress)
      .call();

    let userTokenIds = [];
    for (let i = 0; i < Number(userTokensLength); i++) {
      const tokenId = arenaContract.methods
        .tokenOfOwnerByIndex(ownerAddress, i)
        .call();
      userTokenIds.push(tokenId);
    }
    userTokenIds = await Promise.all(userTokenIds);

    const nfts = [];
    userTokenIds.forEach((tokenId) => {
      const nft = getNft(arenaContract, tokenId);

      nfts.push(nft);
    });

    return Promise.all(nfts);
  } catch (e) {
    console.log({ e });
  }
};

export const fetchNftMeta = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const meta = await axios.get(ipfsUrl);
    return meta;
  } catch (e) {
    console.log({ e });
  }
};

export const fetchNftOwner = async (arenaContract, index) => {
  try {
    return await arenaContract.methods.ownerOf(index).call();
  } catch (e) {
    console.log({ e });
  }
};

export const fetchNftContractOwner = async (arenaContract) => {
  try {
    let owner = await arenaContract.methods.owner().call();
    return owner;
  } catch (e) {
    console.log({ e });
  }
};
