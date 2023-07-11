import './PageItem.css';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useState } from 'react';
import ConfirmationDialog from '../../components/modal/ConfirmationDialog'

const PageItem = (props) => {

    const data = props.pageData;
    const themeData=props.themeData;
    const navigate = useNavigate();
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const handleCloseConfirmationDialog = () => setShowConfirmationDialog(false);
    const handleShowConfirmationDialog = () => setShowConfirmationDialog(true);

    const isActiveChangedHandler = (e) => {
        data.isActive = e.target.checked;
        props.changeHandler(data);
    }

    const addToHeaderChangedHandler = (e) => {
        data.isInHeader = e.target.checked;
        props.changeHandler(data);
    }

    const editPageHandler = () => {
        navigate(`/pages/${data._id}`);
    }

    const deletePageHandler = () => {
        props.deletePageHandler(data._id)
        setShowConfirmationDialog(false);
    }

    return (
        <div className="container-background">
            <Row>
                <Col sm={3} className="d-flex align-items-center">{data.name}</Col>
                <Col sm={5} className="d-flex align-items-center justify-content-center">
                    <Form.Group>
                        <Form.Check inline
                            id={`isActive_${data._id}`}
                            name={`addToHeader_${data._id}`}
                            type="checkbox"
                            label="Active"
                            checked={data.isActive}
                            onChange={isActiveChangedHandler}
                            style={{    
                                '--form-check-input-checked': themeData.secondary
                            }}
                        />
                        <Form.Check inline
                            id={`addToHeader_${data._id}`}
                            name={`addToHeader_${data._id}`}
                            type="checkbox"
                            label="Add to header"
                            checked={data.isInHeader}
                            onChange={addToHeaderChangedHandler}
                            style={{    
                                '--form-check-input-checked': themeData.secondary
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col sm={4} className="d-flex align-items-center justify-content-end">
                    <Button variant="light" style={{ backgroundColor: themeData.secondary, color: 'white' }} onClick={editPageHandler}>
                        Edit page
                    </Button>
                    <Button variant="danger" onClick={handleShowConfirmationDialog} className="marginDelete">
                        Delete Page
                    </Button>
                    <ConfirmationDialog
                        show={showConfirmationDialog}
                        handleClose={handleCloseConfirmationDialog}
                        handleConfirm={deletePageHandler}
                        title="Delete Page"
                        message="Are you sure you want to delete this page?"
                        confirmLabel="Confirm"
                        unconfirmLabel="Cancel"
                        confirmVariant="primary"
                    />
                </Col>
            </Row>
        </div>
    )
}

export default PageItem;