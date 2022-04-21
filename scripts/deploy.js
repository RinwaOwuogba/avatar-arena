// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const AvatarArena = await hre.ethers.getContractFactory("AvatarArena");
  const avatarArena = await AvatarArena.deploy();

  await avatarArena.deployed();

  console.log("AvatarArena deployed to:", avatarArena.address);
  storeContractData(avatarArena);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/AvatarArena-address.json",
    JSON.stringify({ AvatarArena: contract.address }, undefined, 2)
  );

  const AvatarArenaArtifact = artifacts.readArtifactSync("AvatarArena");

  fs.writeFileSync(
    contractsDir + "/AvatarArena.json",
    JSON.stringify(AvatarArenaArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
