import { Button, Modal, Form } from "react-bootstrap";

const EditLogo = (props) => {

    return (
        <div>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                style={{ fontFamily: 'Nunito' }}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Logo
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                        <Form.Label>Upload</Form.Label>
                        <Form.Control type="file" multiple={false} onChange={props.handleChangeLogo} accept="image/*" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide} variant="secondary">Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditLogo;