import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button, Modal, Form, Row, Alert, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import CustomModal from "../../components/modal/CustomModal";
import { addProduct } from "../../redux/reducers/productSlice";
import UploadPic from "./UploadPic";
import { toast, ToastContainer } from "react-toastify";

const AddProduct = (props) => {

    const jwt = Cookies.get('jwt');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const themeData = props.themeData;
    const [images, setImages] = useState([]);
    const [enteredName, setEnteredName] = useState('');
    const [enteredPrice, setEnteredPrice] = useState('');
    const [enteredDescription, setEnteredDescription] = useState('');
    const [showErrEnteredName, setShowErrEnteredName] = useState(false);
    const [showErrEnteredPrice, setShowErrEnteredPrice] = useState(false);
    const [showErrEnteredDescription, setShowErrEnteredDescription] = useState(false);
    const [errMsgImages, setErrMsgImages] = useState('');
    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });

    useEffect(() => {
        if (successMsg.isShown) {
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])

    const handleSubmit = async (e) => {

        if (enteredName.length === 0) {
            setShowErrEnteredName(true);
        }

        if (enteredPrice.length === 0) {
            setShowErrEnteredPrice(true);
        }

        if (enteredDescription.length === 0) {
            setShowErrEnteredDescription(true);
        }

        if (images.length === 0) {
            setErrMsgImages('Please insert image(s) of your product');
        }

        if (images.length > 4) {
            setErrMsgImages('You can only insert up to 4 images');
        }

        else if (enteredName.length !== 0 && enteredPrice.length !== 0 && enteredDescription.length !== 0 && images.length > 0 && images.length <= 4) {
            e.preventDefault();

            const formData = new FormData();
            formData.append('name', enteredName);
            formData.append('price', enteredPrice);
            formData.append('description', enteredDescription);
            images.forEach((image) => {
                console.log(image)
                formData.append('images', image);
            });

            const res = await dispatch(addProduct(formData))
            if (res === 'success') {
                setTimeout(() => {
                    resetStateValues()
                }, 1000);
                setTimeout(() => {
                    setSuccessMsg({ isShown: true, msg: 'New product added successfully' });
                }, 1000);
            }
        }
    }

    const nameChangedHandler = (event) => {
        setEnteredName(event.target.value);
        if (enteredName.length === 0) {
            setShowErrEnteredName(true);
        }
        else setShowErrEnteredName(false);
    }

    const priceChangedHandler = (event) => {
        setEnteredPrice(event.target.value);
        if (enteredPrice.length === 0) {
            setShowErrEnteredPrice(true);
        }
        else setShowErrEnteredPrice(false);
    }

    const descriptionChangedHandler = (event) => {
        setEnteredDescription(event.target.value);
        if (enteredDescription.length === 0) {
            setShowErrEnteredDescription(true);
        }
        else setShowErrEnteredDescription(false);
    }

    const handleFileChange = (event) => {
        setImages(event);

        if (images.length > 4) {
            setErrMsgImages('You can only insert up to 4 images');
        }
        else {
            setErrMsgImages('');
        }
    }

    const resetStateValues = () => {
        setImages([]);
        setEnteredName('');
        setEnteredPrice('');
        setEnteredDescription('');
        setShowErrEnteredName(false);
        setShowErrEnteredPrice(false);
        setShowErrEnteredDescription(false);
        setErrMsgImages('');
        props.onHide();
    };

    return (
        <div>
            <Modal
                {...props}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                onHide={resetStateValues}
                style={{ fontFamily: 'Nunito' }}
            >
                <Modal.Header style={{ backgroundColor: '#f5f5f5' }} closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add New Product
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data" className="p-2">
                        <Row>
                            <Col md={5} className="border-end p-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        id="name"
                                        type="text"
                                        onChange={nameChangedHandler} value={enteredName} />
                                    {showErrEnteredName && <p style={{ color: 'red' }}>Please input your product's name</p>}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control id="price" type="number"
                                        onChange={priceChangedHandler} value={enteredPrice} />
                                    {showErrEnteredPrice && <p style={{ color: 'red' }}>Please input your product's price</p>}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={4} onChange={descriptionChangedHandler} value={enteredDescription} />
                                    {showErrEnteredDescription && <p style={{ color: 'red' }}>Please input your product's description</p>}
                                </Form.Group>
                            </Col>
                            {/* <Col md={1} className="border-end"></Col> */}
                            <Col md={7} className="p-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Images</Form.Label>
                                    <UploadPic themeData={themeData} handleFileChange={handleFileChange}></UploadPic>
                                    {errMsgImages && <p style={{ color: 'red' }}>{errMsgImages}</p>}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#f5f5f5' }}>
                    <Button onClick={resetStateValues} variant="secondary">Discard</Button>
                    <Button variant="light" style={{ '--bs-btn-border-color': themeData.secondary, backgroundColor: themeData.secondary, color: 'white' }} type="submit" onClick={handleSubmit}>Add</Button>
                </Modal.Footer>
            </Modal>

            {/* <ToastContainer
                position='top-center'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            /> */}
        </div >
    )
}

export default AddProduct;