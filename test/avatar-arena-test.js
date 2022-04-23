// const { default: BigNumber } = require("bignumber.js");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("AvatarArena", function () {
  this.timeout(50000); // line 5

  let avatarArena;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    const AvatarArena = await ethers.getContractFactory("AvatarArena");
    [owner, acc1, acc2] = await ethers.getSigners();

    avatarArena = await AvatarArena.deploy();

    // const AvatarArena = await ethers.getContractFactory("AvatarArena");
    // avatarArena = await AvatarArena.attach("0x65A3306DE520E499fB8D3b85602E9474662D565E");
  });

  it("should set the right owner", async function () {
    expect(await avatarArena.owner()).to.equal(owner.address);
  });

  it("should mint one NFT", async function () {
    expect(await avatarArena.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://example.com/1";

    await mintNFT(avatarArena, owner, acc1.address, tokenURI);

    expect(await avatarArena.balanceOf(acc1.address)).to.equal(1);
  });

  it("should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";

    await mintNFT(avatarArena, owner, acc1.address, tokenURI_1);
    await mintNFT(avatarArena, owner, acc2.address, tokenURI_2);

    expect(await avatarArena.tokenURI(0)).to.equal(tokenURI_1);
    expect(await avatarArena.tokenURI(1)).to.equal(tokenURI_2);
  });

  describe("startBattle", () => {
    it("should start a pending battle if no pending battle is available", async () => {
      await mintNFT(avatarArena, owner, owner.address);

      const tokenID = 0;
      const trx = await avatarArena.connect(owner).startBattle(tokenID);
      await trx.wait();

      const battle = await avatarArena.connect(owner).getBattle();

      expect(battle.players[0].player).to.eql(owner.address);
      expect(battle.players[0].nft).to.eq(BigNumber.from(tokenID));

      // no winner should exist until game is completed
      expect(battle.winner).to.eq(-1);
    });

    it("should join latest pending battle and complete it", async () => {
      await mintNFT(avatarArena, owner, owner.address);
      await mintNFT(avatarArena, acc1, acc1.address);

      const tokenID_1 = 0;
      const tokenID_2 = 1;

      // NFT Avatars should start with zero wins
      const wins_1 = await avatarArena.connect(owner).getAvatarWins(tokenID_1);
      const wins_2 = await avatarArena.connect(owner).getAvatarWins(tokenID_1);

      expect(wins_1).to.eq(0);
      expect(wins_2).to.eq(0);

      const battleId = 0;
      await avatarArena.connect(owner).startBattle(tokenID_1);
      await expect(avatarArena.connect(acc1).startBattle(tokenID_2))
        .to.emit(avatarArena, "BattleComplete")
        .withArgs(battleId);

      const battle = await avatarArena.connect(acc1).getBattle();

      expect(battle.players[0].player).to.eql(owner.address);
      expect(battle.players[1].player).to.eql(acc1.address);
      expect(BigNumber.from(battle.winner).toNumber()).to.be.oneOf([0, 1]);

      const winningNftId = battle.players[battle.winner].nft;
      expect(
        await avatarArena.connect(owner).getAvatarWins(winningNftId)
      ).to.eq(1);
    });

    it("should fail to start a battle with a token sender does not own", async () => {
      await mintNFT(avatarArena, owner, acc1.address);

      const tokenID_1 = 0;

      await expect(
        avatarArena.connect(owner).startBattle(tokenID_1)
      ).to.be.revertedWith("Arena: Cannot start battle with non-owned token");
    });

    it("should get an empty battle if sender doesn't have a battle", async () => {
      const battle = await avatarArena.connect(owner).getBattle();

      expect(battle.players).to.have.length(0);
    });

    it("should fail to start another battle while in a pending battle", async () => {
      await mintNFT(avatarArena, owner, owner.address);

      const tokenId = 0;
      const trx = await avatarArena.connect(owner).startBattle(tokenId);
      await trx.wait();

      await expect(
        avatarArena.connect(owner).startBattle(tokenId)
      ).to.be.revertedWith(
        "Arena: Cannot start another battle while in a battle"
      );
    });
  });
});

const mintNFT = async (
  contractInstance,
  as,
  to,
  tokenURI = "https://example.com/1"
) => {
  const trx1 = await contractInstance.connect(as).safeMint(to, tokenURI);
  return trx1.wait();
};
