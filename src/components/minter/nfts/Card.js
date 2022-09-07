import { useContractKit } from "@celo-tools/use-contractkit";
import { Col, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";


// NFT Cards Functionality

  // Button function to display a particular button depending on the owner and the availability of the powerup
  const buttonFunc = (available, buyNft, owner, defaultAccount, handleShow) => {
    let btnText;
    if(owner !== defaultAccount) {
      !available ? btnText = <button className="sold_nft">Sold</button> : btnText = <button className="buy_nft" onClick={buyNft}>Buy</button>
    }
    else {
      available ? btnText = <button className="sold_nft">Owned</button> : btnText = <button className="owned_nft" onClick={handleShow}>Resell</button>
    }
    return <>{btnText}</>
  }


const Nft = ({ nft, buyNft, data }) => {
  const { image, name, tokenId, price, available, owner } = nft;

  const { kit } = useContractKit();
  const { defaultAccount } = kit;
  
  const [show, setShow] = useState(false);
  const [newPrice, setPrice] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const isFormFilled = () => price;

  return (
    <>
    <Col key={tokenId} className="mb-5">
      <div className="card_container">
        <div className="card_image">
          <img src={image} alt="Powerup"/>
        </div>

        <div className="card_details">
          <h3>{name}</h3>
          <p className="card_price">{price / 10 ** 18} cUSD</p>
          {/* button function goes here */}
          {buttonFunc(available, buyNft, owner, defaultAccount, handleShow)}
        </div>
      </div>
    </Col>

    {/* Modal For Reslling A Powerup*/}
    <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="header_text">Set Price</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="upload_powerup_form">
            <Form.Control
              className="mb-4"
              type="text"
              placeholder="Price"
              onChange={(e) => {
                // listen to the price input and set its value
                setPrice(e.target.value);
              }}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer className="modal_footer">
          <button
            className="upload_powerup"
            disabled={!isFormFilled()}
            onClick={() => {
              // send data to the parent element to be used to change the price of the powerup
              data({
                newPrice,
                tokenId
              })
              handleClose();
            }}
            >
            Set
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Nft;
