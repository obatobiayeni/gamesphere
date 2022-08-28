import {useContract} from './useContract';
import GamesphereNFTAbi from '../contracts/GamesphereNFT.json';
import GamesphereNFTContractAddress from '../contracts/GamesphereNFT-address.json';


// export interface for NFT contract
export const useGamesphereContract = () => useContract(GamesphereNFTAbi.abi, GamesphereNFTContractAddress.GamesphereNFT);
