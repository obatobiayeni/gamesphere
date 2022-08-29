// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GamesphereNFT is ERC721, ERC721Enumerable, ERC721URIStorage{
    constructor() ERC721("GamesphereNFT", "GNFT") {}

    using Counters for Counters.Counter;

    Counters.Counter private count;

    struct Powerup {
        address payable owner;
        uint256 price;
        bool isAvailable;
    }

    mapping(uint256 => Powerup) internal powerups;


    modifier checkPrice(uint _price){
        require(_price > 0, "Price must be at least 1");
        _;
    }

    modifier checkOwner(uint _tokenId){
        require(msg.sender == powerups[_tokenId].owner, "Only owner can resell a powerup");
        _;
    }
/**
    @dev Upload Powerup Function
    @notice takes in  @param uri and @param price as arguments
    intialises the tokenId and the powerup availabilty
    assigns the data to the powerups mapping passing the length as the key
    calls the createToken function to create the NFT from the passed data
    increments the length and count
 */
    function uploadPowerup(
        string calldata _uri,
        uint256 _price
    ) external checkPrice(_price) {
        require(bytes(_uri).length > 0, "Empty uri");
        uint256 _tokenId = count.current(); //initializing the token ID to the current count
        count.increment();
        bool _isAvailable = true;   //initializing the value of isAvailable to false for newly uploaded powerups

        powerups[_tokenId] =  Powerup(
            payable(msg.sender),
            _price,
            _isAvailable
        );

         _safeMint(msg.sender, _tokenId); //minting the jersey
        _setTokenURI(_tokenId, _uri); //creating a url using the token ID and the uri provided
        
    }

/**
    @dev Buy Powerup Function
     requires that the price, buyer and tokenId is valid and the powerup is available
     transfers the token using the tokenId to the buyer
    transfers the money to the seller
    @notice sets the new owner to be the buyer and the availability to false
 */
    function buyPowerup(uint256 _tokenId) external payable {
         require(msg.sender != powerups[_tokenId].owner, "Owners cant buy their powerup");    // the buyer must not be the owner
        uint256 _price = powerups[_tokenId].price; //assigning the NFT price to a variable
        bool _isAvailable = powerups[_tokenId].isAvailable;    //assigning the NFT isAvailable property to a variable

        require(msg.value == _price, "Enter the correct price"); // price of the NFT must be met
       
        require(_isAvailable, "Powerup already sold"); //item must be available for sale

        address _owner = ownerOf(_tokenId);
        _transfer(_owner, msg.sender, _tokenId);    //transfering ownership of the NFT to the buyer
        
        powerups[_tokenId].owner = payable(msg.sender);  //changing the owner variable of the NFT to the buyer
        powerups[_tokenId].isAvailable = false;    // setting isAvailable to true
        (bool success,) = payable(_owner).call{value: msg.value}(""); //tranfering money to the seller of the NFT
        require(success, "Transfer failed");

    }

/**
    Read Powerup Function
    takes in the index as an argument
    uses the index as key to get specific powerup
    returns the powerup save in the powerups mapping with that index
 */
    function readPowerup(uint256 _index) public view returns (
        address payable,
        uint256,
        bool
    ) {
        return (
            powerups[_index].owner,
            powerups[_index].price,
            powerups[_index].isAvailable
        );
    }

/**
    Resell Powerup Function
    takes in the tokenId and the new price as arguments
    requires that the caller is the owner of the powerup, that the powerup exists and is not already available for sale
    changes the availability to treu and assigns the price as the new price
 */
    function resellPowerup(uint256 _tokenId, uint256 _price) external checkPrice(_price) checkOwner(_tokenId) {
        
        require(!powerups[_tokenId].isAvailable, "Powerup is already up for sale");

        powerups[_tokenId].isAvailable = true;
        powerups[_tokenId].price = _price;
    }

    /// @dev cancels sales on a token
    function cancelSale(uint _tokenId) public checkOwner(_tokenId) {
        powerups[_tokenId].isAvailable = false;
    }



/**
    Get Powerup Length Function
    takes no argument
    returns the length as the length of the total powerups stored
 */
    function getPowerupLength() public view returns (uint256) {
        return count.current();
    }



    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
