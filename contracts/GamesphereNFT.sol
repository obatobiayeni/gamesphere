// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GamesphereNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    constructor() ERC721("GamesphereNFT", "GNFT") {}

    using Counters for Counters.Counter;

    Counters.Counter private count;
    uint256 internal length = 0;

    struct Powerup {
        address payable owner;
        string name;
        string image;
        uint256 tokenId;
        uint256 price;
        bool isAvailable;
    }

    mapping(uint256 => Powerup) internal powerups;

    function createToken(string memory uri, uint256 _tokenId) public returns (uint256) {
        // comment out the require statements when testing the smart contract
        require(_tokenId == powerups[_tokenId].tokenId , "Powerup with this token ID not found");    // token ID must exist before it can be minted
        require(msg.sender == powerups[_tokenId].owner, "Only owner can mint this NFT");  // only the owner of a powerup can mint the powerup

        uint256 tokenId = powerups[_tokenId].tokenId;

        _safeMint(msg.sender, tokenId); //mint the powerup to the owner's account
        _setTokenURI(tokenId, uri); //creating a url using the token ID and the uri provided

        return tokenId;
    }

/**
    Upload Powerup Function
    takes in the name, image, uri and price as arguments
    intialises the tokenId and the powerup availabilty
    assigns the data to the powerups mapping passing the length as the key
    calls the createToken function to create the NFT from the passed data
    increments the length and count
 */
    function uploadPowerup(
        string memory _name,
        string memory _image,
        string memory _uri,
        uint256 _price
    ) external {
        require(_price > 0, "Price must be at least 1");

        uint256 _tokenId = count.current(); //initializing the token ID to the current count
        bool _isAvailable = true;   //initializing the value of isAvailable to false for newly uploaded powerups

        powerups[length] =  Powerup(
            payable(msg.sender),
            _name,
            _image,
            _tokenId,
            _price,
            _isAvailable
        );

        createToken(_uri, _tokenId);    //minting the powerup during upload
        
        length ++;
        count.increment();
    }

/**
    Buy Powerup Function
    takes in the tokenId as an argument
    requires that the price, buyer and tokenId is valid and the powerup is available
    transfers the token using the tokenId to the buyer
    transfers the money to the seller
    sets the new owner to be the buyer and the availability to false
 */
    function buyPowerup(uint256 _tokenId) external payable {
        uint256 _price = powerups[_tokenId].price; //assigning the NFT price to a variable
        bool _isAvailable = powerups[_tokenId].isAvailable;    //assigning the NFT isAvailable property to a variable

        require(msg.value >= _price, "Enter the correct price"); // price of the NFT must be met
        require(msg.sender != powerups[_tokenId].owner, "Owners cant buy their powerup");    // the buyer must not be the owner
        require(_isAvailable, "Powerup already sold"); //item must be available for sale
        require(_tokenId == powerups[_tokenId].tokenId, "Powerup does not exist");    //item must exist

        address _owner = ownerOf(_tokenId);
        _transfer(_owner, msg.sender, _tokenId);    //transfering ownership of the NFT to the buyer
        
        powerups[_tokenId].owner.transfer(msg.value);    //tranfering money to the seller of the NFT

        powerups[_tokenId].owner = payable(msg.sender);  //changing the owner variable of the NFT to the buyer
        powerups[_tokenId].isAvailable = false;    // setting isAvailable to true
    }

/**
    Read Powerup Function
    takes in the index as an argument
    uses the index as key to get specific powerup
    returns the powerup save in the powerups mapping with that index
 */
    function readPowerup(uint256 _index) external view returns (
        address payable,
        string memory,
        string memory,
        uint256,
        uint256,
        bool
    ) {
        return (
            powerups[_index].owner,
            powerups[_index].name,
            powerups[_index].image,
            powerups[_index].tokenId,
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
    function resellPowerup(uint256 _tokenId, uint256 _price) external  {
        require(msg.sender == powerups[_tokenId].owner, "Only owner can resell a powerup");
        require(_tokenId == powerups[_tokenId].tokenId, "Powerup not available");
        require(!powerups[_tokenId].isAvailable, "Powerup is already up for sale");

        powerups[_tokenId].isAvailable = true;
        powerups[_tokenId].price = _price;
    }

/**
    Get Powerup Length Function
    takes no argument
    returns the length as the length of the total powerups stored
 */
    function getPowerupLength() public view returns (uint256) {
        return length;
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
