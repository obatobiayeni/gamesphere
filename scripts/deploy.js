const hre = require("hardhat");

async function main() {
  const GamesphereNFT = await hre.ethers.getContractFactory("GamesphereNFT");
  const gamesphereNft = await GamesphereNFT.deploy();

  await gamesphereNft.deployed();

  console.log("GamesphereNFT deployed to:", gamesphereNft.address);
  storeContractData(gamesphereNft)
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/GamesphereNFT-address.json",
    JSON.stringify({ GamesphereNFT: contract.address }, undefined, 2)
  );

  const GamesphereNFTArtifact = artifacts.readArtifactSync("GamesphereNFT");

  fs.writeFileSync(
    contractsDir + "/GamesphereNFT.json",
    JSON.stringify(GamesphereNFTArtifact, null, 2)
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
