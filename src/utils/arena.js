import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { BigNumber } from "ethers";

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
      return await arenaContract.methods
        .safeMint(ownerAddress, url)
        .send({ from: defaultAccount });

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

export const fetchNft = (arenaContract, tokenId) =>
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

export const isTokenIdValid = async (arenaContract, tokenId) => {
  const nftsLength = await arenaContract.methods.totalSupply().call();
  return tokenId <= nftsLength - 1;
};

export const getAllNfts = async (arenaContract) => {
  try {
    const nfts = [];
    const nftsLength = await arenaContract.methods.totalSupply().call();
    for (let i = 0; i < Number(nftsLength); i++) {
      const nft = fetchNft(arenaContract, i);
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
      const nft = fetchNft(arenaContract, tokenId);

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
    return  await axios.get(ipfsUrl);

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
    return await arenaContract.methods.owner().call();

  } catch (e) {
    console.log({ e });
  }
};

export const fetchLatestBattle = async (arenaContract) => {
  let battle = await arenaContract.methods.getBattle().call();

  if (battle.players.length === 0) return null;

  return await formatBattleData(arenaContract, battle);
};

const getWinnerAddress = (battle) => {
  const winner = BigNumber.from(battle.winner).toNumber();

  if (winner === -1) return "";

  if (winner === 0 || winner === 1) return battle.players[winner].player;
};

const formatBattleData = async (arenaContract, battle) => {
  const formattedBattle = {
    players: [{}, {}],
    createdAt: "",
    winner: "",
  };

  formattedBattle.createdAt = new Date(battle.createdAt * 1000);
  [formattedBattle.players[0].nft, formattedBattle.players[1].nft] =
    await Promise.all([
      fetchNft(arenaContract, battle.players[0].nft),
      battle.players[1] ? fetchNft(arenaContract, battle.players[1].nft) : null,
    ]);

  formattedBattle.winner = getWinnerAddress(battle);

  return formattedBattle;
};

export const startBattle = async (arenaContract, performActions, tokenId) => {
  await performActions(async (kit) => {
    const { defaultAccount } = kit;

    await arenaContract.methods
      .startBattle(tokenId)
      .send({ from: defaultAccount });
  });
};
