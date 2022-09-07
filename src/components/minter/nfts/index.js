import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
  getNfts,
  getPowerup,
  resellNft,
  createNft
} from "../../../utils/minter";
import { Row } from "react-bootstrap";

const NftList = ({ minterContract }) => {
  const { performActions, address } = useContractKit();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNFTAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getNfts(minterContract);
      if (!allNfts) return;
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract]);

  // Add new NFT
  const addNft = async (data) => {
    try {
      setLoading(true);

      // create an nft functionality
      await createNft(minterContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getNFTAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };
  
  // Buy available NFT
  const buyNft = async (tokenId) => {
    try {
      setLoading(true);

      // Create a buy NFT functionality
      await getPowerup(minterContract, tokenId, performActions);
      getNFTAssets();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change price function
   * takes in the data received from the card component
   * destructure data
   * passes the data to the resellNft function imported from the minter folder
   * calls the getNFTAssets function to reload all nfts and apply change in real time
   * 
   */
  const changePrice = async (data) => {
    try {
      setLoading(true)
      // console.log(data)
      const { newPrice, tokenId } = data
      // console.log(newPrice, tokenId)
      const _price = ethers.utils.parseUnits(String(newPrice), "ether");
      
      await resellNft(minterContract, tokenId, _price, performActions)
      getNFTAssets();
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    try {
      if (address && minterContract) {
        getNFTAssets();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getNFTAssets]);

  if (address) {
    return (
      <>
        {!loading ? (
          <div className="marketplace">
            <div className="d-flex align-items-center justify-content-between">
              <div className="search_bar ps-2 pe-3 d-flex align-items-center justify-content-between">
                <input type="text" id="search" placeholder="Search"/>
                <label for="search"><i class="bi bi-search"></i></label>
              </div>
              <AddNfts save={addNft} address={address} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 my-5 g-xl-4 g-xxl-5">
              {/* display all NFTs */}
              {nfts.map((_nft) => (
                <Nft
                  key={_nft.index}
                  buyNft={() => buyNft(_nft.tokenId)}
                  nft={{
                    ..._nft,
                  }}
                  data={changePrice}
                />
              ))}
            </Row>
          </div>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {
  // props passed into this component
  minterContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  minterContract: null,
};

export default NftList;
