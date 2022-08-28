const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GamesphereNFT", function () {
  this.timeout(50000);

  let gamesphereNFT;
  let owner;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const GamesphereNFT = await ethers.getContractFactory("GamesphereNFT");
    [owner, acc1] = await ethers.getSigners();

    gamesphereNFT = await GamesphereNFT.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await gamesphereNFT.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function () {
    const tokenURI = "https://example.com/1";
    const tokenId = 0;
    const tx = await gamesphereNFT.connect(owner).createToken(tokenURI, tokenId);
    await tx.wait();
  });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_2 = "https://example.com/2";
    const tokenId_2 = 0;

    const tx2 = await gamesphereNFT.connect(owner).createToken(tokenURI_2, tokenId_2);
    await tx2.wait();

    expect(await gamesphereNFT.tokenURI(0)).to.equal(tokenURI_2);
  });
});
