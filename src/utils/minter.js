import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { ethers } from "ethers";

// initialize IPFS
const getAccessToken = () => {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ1NzNjNjY2ODNFMEE1MTdkMTNmMUJmZDYwMzkzZDUyMWM2NGRDYzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjA5MTc4NDM4NzQsIm5hbWUiOiJjZWxvMjAxIn0.YlJ4cJ6i3sZ3nNoFArgzasDPmEhZSmzHqeOFTVl3BTw";
}
const makeStorageClient = () => {
  return new Web3Storage({ token: getAccessToken() })
}
const client = makeStorageClient()

const makeFileObjects = (file) => {
  const blob = new Blob([JSON.stringify(file)], { type: "application/json" })

  const files = [new File([blob], `${file.name}.json`)]
  return files
}

// mint an NFT
export const createNft = async (
  minterContract,
  performActions,
  { name, price, ipfsImage, ownerAddress }
) => {
  await performActions(async (kit) => {
    if (!name || !ipfsImage || !price) return;
    const { defaultAccount } = kit;

    // convert NFT metadata to JSON format
    const data = {
      name,
      image: ipfsImage,
      price,
      owner: defaultAccount,
    };

    const files = makeFileObjects(data)

    try {
      // save NFT metadata to IPFS
      const file_cid = await client.put(files);

      // IPFS url for uploaded metadata
      const url = `https://${file_cid}.ipfs.w3s.link/${data.name}.json`;
      const _price = ethers.utils.parseUnits(String(price), "ether");

      // upload the NFT, mint the NFT and save the IPFS url to the blockchain
      let transaction = await minterContract.methods
        .uploadPowerup(name, ipfsImage, url, _price)
        .send({ from: defaultAccount });

      return transaction;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};

// function to upload a file to IPFS
export const uploadToIpfs = async (e) => {
  const image = e.target.files;
  if (!image) return;
  try {
    const image_cid = await client.put(image);
    const image_res = await client.get(image_cid)
    const image_file = await image_res.files()
    
    for (const file of image_file) {
      const image_url = `https://${file.cid}.ipfs.w3s.link/`
      return image_url
    }
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

// fetch all NFTs on the smart contract
export const getNfts = async (minterContract) => {
  try {
    const nfts = [];
    const nftsLength = await minterContract.methods.getPowerupLength().call();
    if(Number(nftsLength) >= 1) {
      for (let i = 0; i < Number(nftsLength); i++) {
        const nft = new Promise(async (resolve) => {
          const image = await minterContract.methods.readPowerup(i).call();
          const res = await minterContract.methods.tokenURI(i).call();
          const meta = await fetchNftMeta(res);
          const owner = await fetchNftOwner(minterContract, i);
  
          resolve({
            index: i,
            owner,
            name: meta.name,
            image: meta.image,
            tokenId: i,
            price: image[4],
            available: image[5]
          });
        });
        nfts.push(nft);
      }
      return Promise.all(nfts);
    }
    else {
      console.log("No powerup available")
    }

  } catch (e) {
    console.log({ e });
  }
};

// get the metedata for an NFT from IPFS
export const fetchNftMeta = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const data = await fetch(ipfsUrl);
    const meta = await data.json()

    return meta;
  } catch (e) {
    console.log({ e });
  }
};

// get the owner address of an NFT
export const fetchNftOwner = async (minterContract, index) => {
  try {
    return await minterContract.methods.ownerOf(index).call();
  } catch (e) {
    console.log({ e });
  }
};

// get the address that deployed the NFT contract
export const fetchNftContractOwner = async (minterContract) => {
  try {
    let owner = await minterContract.methods.owner().call();
    return owner;
  } catch (e) {
    console.log({ e });
  }
};

export const getPowerup = async (
  minterContract,
  tokenId,
  performActions
) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      const image = await minterContract.methods.readPowerup(tokenId).call();
      await minterContract.methods
        .buyPowerup(tokenId)
        .send({ from: defaultAccount, value: image[4] });
    });
  } catch (error) {
    console.log({ error });
  }
};

export const resellNft = async (
  minterContract,
  tokenId,
  price,
  performActions
) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await minterContract.methods
        .resellPowerup(tokenId, price)
        .send({ from: defaultAccount });
    });
  } catch (error) {
    console.log({ error });
  }
};

export const getOwners = async (minterContract) => {
  try {
    const ownerCount = await minterContract.methods.getOwners().call();
    return ownerCount;
  } catch (error) {
    console.log({ error });
  }
};
