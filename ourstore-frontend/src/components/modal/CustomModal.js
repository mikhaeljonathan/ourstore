import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { toast, ToastContainer } from "react-toastify";

const modalTitleStyle = {
  textAlign: 'center',
  backgroundColor: 'red',
  color: 'white'
}

const modalFooterStyle = {
  border: 'none'
}

export default function CustomModal({ show, message, handleShow, handleClose }) {

  return (
    <>
      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header style={modalTitleStyle} closeButton>
          <strong>
            {message}
          </strong>
        </Modal.Header>
      </Modal>
    </>
  );
}