/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form } from "react-bootstrap";
import { uploadToIpfs } from "../../../utils/minter";


const AddNfts = ({ save, address }) => {
  const [name, setName] = useState("");
  const [ipfsImage, setIpfsImage] = useState("");
  const [price, setPrice] = useState("");
  const [show, setShow] = useState(false);


  // check if all form data has been filled
  const isFormFilled = () => {
    if(name && ipfsImage && price) {
      return true
    }
    else {
      return false
    }
  }  

  // close the popup modal
  const handleClose = () => {
    setShow(false);
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  return (
    <>
      <button type="button"
        onClick={handleShow}
        className="add_powerup d-flex align-items-center justify-content-around"
     >Add <i class="bi bi-plus fs-5"></i></button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title className="header_text d-flex">Upload Powerup</Modal.Title>
        </Modal.Header>

        <div className="powerup_img_file">
          <input
            id="image"
            type="file"
            onChange={async (e) => {
              console.log(e.target.files)
              const imageUrl = await uploadToIpfs(e);
              // console.log(imageUrl)
              if (!imageUrl) {
                alert("failed to upload image");
                return;
              }
              setIpfsImage(imageUrl);
            }}
          />
          <label id="add_image" for="image">
            <i class="bi bi-plus"></i>
            Upload File
          </label>
        </div>

        <Modal.Body>
          <Form className="upload_powerup_form">
            <Form.Control
              className="mb-4"
              type="text"
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <Form.Control
              className="mb-4"
              type="text"
              placeholder="Price"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer className="d-flex jusitify-content-center align-items-center">
          <button className="close_btn" onClick={handleClose}>
            Close
          </button>
          <button
            className="upload_powerup"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                name,
                price,
                ipfsImage,
                ownerAddress: address
              });
              handleClose();
            }}
            >
            Upload
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {

  // props passed into this component
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default AddNfts;
