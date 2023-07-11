import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from "react-bootstrap";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";

const AddPage = (props) => {

    const jwt = Cookies.get('jwt');

    const [title, setTitle] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isInHeader, setIsInHeader] = useState(false);
    const themeData = props.themeData;

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPage = {
            "name": title,
            "isActive": isActive,
            "isInHeader": isInHeader,
        };

        axios.post(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/pages`, newPage, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                props.onAdded();
                props.onHide();
                // setTimeout(() => {
                // window.location.reload()
                // }, 3000);
            })
            .catch((err) => {
                setTimeout(() => {
                    alert(err);
                }, 2000);
                console.log(err)
            });
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleIsActiveChange = (event) => {
        setIsActive(event.target.checked);
    };

    const handleIsInHeaderChange = (event) => {
        setIsInHeader(event.target.checked);
    };

    return (
        <React.Fragment>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                style={{ fontFamily: 'Nunito' }}>
                <Modal.Header closeButton style={{ backgroundColor: '#f5f5f5' }}>
                    <Modal.Title>Add Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Your Page Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={handleTitleChange} />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Check style={{ '--form-check-input-checked': themeData.secondary }} inline type="checkbox" label="Active" checked={isActive} onChange={handleIsActiveChange} />
                            <Form.Check style={{ '--form-check-input-checked': themeData.secondary }} inline type="checkbox" label="Add to Header" checked={isInHeader} onChange={handleIsInHeaderChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#f5f5f5' }}>
                    <Button variant="light" style={{ backgroundColor: themeData.secondary, color: 'white' }} onClick={handleSubmit}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default AddPage;