import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Alert, Row, Col } from "react-bootstrap";
import { updateSingleProduct } from "../../redux/reducers/singleproductSlice"
import EditProductPic from "./EditProductPic";
import { toast, ToastContainer } from "react-toastify";

const EditProduct = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const listproducts = props.listproducts
    const id = props.id
    const themeData = props.themeData

    const [enteredName, setEnteredName] = useState(listproducts.name);
    const [enteredPrice, setEnteredPrice] = useState(listproducts.price);
    const [enteredDescription, setEnteredDescription] = useState(listproducts.description);
    const [enteredImages, setEnteredImages] = useState('');
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

    const handleSubmit = async () => {

        if (enteredName.length === 0) {
            setShowErrEnteredName(true);
        }

        if (enteredPrice.length === 0) {
            setShowErrEnteredPrice(true);
        }

        if (enteredDescription.length === 0) {
            setShowErrEnteredDescription(true);
        }

        if (enteredImages.length === 0) {
            setErrMsgImages('Please insert image(s) of your product');
        }

        // console.log(images.length)
        if (enteredImages.length > 4) {
            setErrMsgImages('You can only insert up to 4 images');
        }

        else if (enteredName.length !== 0 && enteredPrice.length !== 0 && enteredDescription.length !== 0 && enteredImages.length > 0 && enteredImages.length <= 4) {
            const formData = new FormData();
            formData.append('name', enteredName);
            formData.append('price', enteredPrice);
            formData.append('description', enteredDescription);
            if (Array.isArray(enteredImages) && enteredImages.every(image => image instanceof File)) {
                enteredImages.forEach((image) => {
                    formData.append('images', image);
                });
            }

            const res = await dispatch(updateSingleProduct(id, formData))
            if (res === 'success') {
                setTimeout(() => {
                    resetStateValues();
                    // setSuccessMsg({ isShown: true, msg: 'Product updated successfully' });
                    props.alertSuccessToast();
                }, 1000);
                // setTimeout(() => {
                // window.location.reload();
                // }, 1000);
                // console.log(successMsg.isShown)
            }
        }
    }

    const handleFileChange = (event) => {
        setEnteredImages(event);
        // console.log(images)
        if (enteredImages.length > 4) {
            setErrMsgImages('You can only insert up to 4 images');
        }
        else {
            setErrMsgImages('');
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

    const resetStateValues = () => {
        setEnteredImages(listproducts.images);
        setEnteredName(listproducts.name);
        setEnteredPrice(listproducts.price);
        setEnteredDescription(listproducts.description);
        setShowErrEnteredName(false);
        setShowErrEnteredPrice(false);
        setShowErrEnteredDescription(false);
        setErrMsgImages('');
        props.onHide();
    };

    return (
        <div>
            <ToastContainer
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
            />
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
                        Edit Product
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Row>
                            <Col md={5} className="border-end p-4">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" onChange={nameChangedHandler} value={enteredName} />
                                    {showErrEnteredName && <p style={{ color: 'red' }}>Please input your product's name</p>}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInputPrice1">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="number" onChange={priceChangedHandler} value={enteredPrice} />
                                    {showErrEnteredPrice && <p style={{ color: 'red' }}>Please input your product's price</p>}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={4} onChange={descriptionChangedHandler} value={enteredDescription} />
                                    {showErrEnteredDescription && <p style={{ color: 'red' }}>Please input your product's description</p>}
                                </Form.Group>
                            </Col>
                            {/* {Object.keys(listproducts.images).map((key) => (
                            <Form.Group key={key} className="mb-3" controlId="exampleForm.ControlInput">
                                <Form.Label>Product's Images</Form.Label>
                                <Form.Control type="text" name="imageLink" placeholder={listproducts.images[key].imageLink} onChange={event => handleImagesChange(key, event)} value={enteredImages.imageLink}/>
                            </Form.Group>
                        ))} */}
                            <Col md={7} className="p-4">
                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                    <Form.Label>Images</Form.Label>
                                    {/* <Form.Control type="file" multiple onChange={fileImageChangeHandler} accept="image/*" /> */}
                                    <EditProductPic themeData={themeData} listproducts={listproducts} handleFileChange={handleFileChange}></EditProductPic>
                                    {errMsgImages && <p style={{ color: 'red' }}>{errMsgImages}</p>}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#f5f5f5' }}>
                    <Button onClick={resetStateValues} variant="secondary">Discard</Button>
                    <Button variant="light" style={{ '--bs-btn-border-color': themeData.secondary, backgroundColor: themeData.secondary, color: 'white' }} onClick={handleSubmit} type="submit">Save</Button>
                </Modal.Footer>
            </Modal>
        </div >
    )

}

export default EditProduct;