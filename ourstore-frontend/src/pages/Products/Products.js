import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Button, Container, Row, Col, Accordion } from "react-bootstrap";
import GridContainerLayout from "./GridContainerLayout";
import ListContainerLayout from "./ListContainerLayout";
import Cookies from "js-cookie";
import { addProduct, fetchProducts } from "../../redux/reducers/productSlice";
import { fetchTheme, updateTheme } from "../../redux/reducers/themeSlice";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";
import axios from "axios";
import './Products.css';
import AddProduct from "./AddProduct";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import '../landingPage/LandingPage.css'
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router";

const Products = () => {

    const jwt = Cookies.get('jwt');
    const dispatch = useDispatch();
    const location = useLocation();
    const redux = useSelector(state => state)
    const products = redux.products
    const theme = redux.theme.theme
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    let isDeleted = location.state?.isDeleted;

    const [viewType, setViewType] = useState(null);
    const [columnSize, setColumnSize] = useState(5);
    const [layoutType, setLayoutType] = useState(null);
    // if is disabled true, then it is list
    const [isDisabled, setIsDisabled] = useState(false);
    const [addProductModalShow, setAddProductModalShow] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });

    useEffect(() => {
        if (isDeleted) {
            setSuccessMsg({ isShown: true, msg: 'Product deleted successfully' });
            window.history.replaceState({}, document.title)
        }
    }, [isDeleted])

    useEffect(() => {
        dispatch(fetchProducts())
        dispatch(fetchTheme())

        // check if user is logged in or not
        axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/jwt/check`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/me`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
                    .then((res) => {
                        if (res.data.role === 'admin') {
                            setIsAdmin(true);
                        }
                    })
            })
            .catch((err) => {
                setIsAdmin(false)
            });
    }, [dispatch, addProductModalShow, jwt]);

    useEffect(() => {
        if (theme.length > 0) {
            setThemeData(theme[0]);
            setViewType(theme[0].viewType);
            setIsDisabled(theme[0].viewType === "list");
            setLayoutType(theme[0].templateId);
            setColumnSize(theme[0].columnSize === 0 ? 3 : theme[0].columnSize);
        }
    }, [dispatch, theme]);

    useEffect(() => {
        if (successMsg.isShown) {
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])


    if (products.products.length === 0 || theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    const onClickViewTypeButton = (props) => {
        if (props === 'list') {
            setViewType('list');
            setIsDisabled(true);
            if (layoutType === '1') setLayoutType('3')
            else if (layoutType === '2') setLayoutType('4')
        }
        else {
            setViewType('grid');
            setIsDisabled(false);
            if (layoutType === '3') setLayoutType('1')
            else if (layoutType === '4') setLayoutType('2')
        }
    }

    const onClickColumnSizeButton = (props) => {
        setColumnSize(props);
    }

    const onClickLayoutTypeButton = (props) => {
        setLayoutType(props);
    }

    const handleSaveLayoutTheme = async (e) => {
        e.preventDefault();
        let raw = {
            "columnSize": viewType === 'list' ? 0 : columnSize,
            "viewType": viewType,
            "templateId": layoutType
        };

        const res = await dispatch(updateTheme(raw))
        if (res === 'success') {
            setSuccessMsg({ isShown: true, msg: 'Layout updated successfully' });
        }
    }

    const r = parseInt(themeData.secondary.substring(1, 3), 16);
    const g = parseInt(themeData.secondary.substring(3, 5), 16);
    const b = parseInt(themeData.secondary.substring(5, 7), 16);

    return (
        <div className='wrapper'>
            <Header />
            <Container fluid className="p-0 m-0 content">
                <ToastContainer
                    position='top-center'
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    theme='colored'
                />

                {isAdmin === true && <div className="p-3">
                    <Accordion defaultActiveKey={0}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header style={{ '--accordion-buttton-not-collapsed': `rgba(${r}, ${g}, ${b}, 0.45)`, '--accordion-buttton-collapsed': themeData.secondary }}>Layout Settings</Accordion.Header>
                            <Accordion.Body>
                                <Container fluid className="p-0">
                                    <Row>
                                        <Col md={4}>
                                            <div>Item View Type</div>
                                            <div className="btn-group" role="group">
                                                <input type="radio" className="btn-check" name="itemViewType" id="listRadioBtn" value="list" defaultChecked={isDisabled} />
                                                <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="listRadioBtn" onClick={() => onClickViewTypeButton('list')}>List</label>

                                                <input type="radio" className="btn-check" name="itemViewType" id="gridRadioBtn" value="grid" defaultChecked={!isDisabled} />
                                                <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="gridRadioBtn" onClick={() => onClickViewTypeButton('grid')}>Grid</label>
                                            </div>

                                            <div>Column Size</div>
                                            <div className="btn-group" role="group">
                                                <input type="radio" className="btn-check" name="columnSize" id="col3RadioBtn" value="3" disabled={isDisabled} defaultChecked={columnSize === 3} />
                                                <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="col3RadioBtn" onClick={() => onClickColumnSizeButton(3)}>3</label>

                                                <input type="radio" className="btn-check" name="columnSize" id="col4RadioBtn" value="4" disabled={isDisabled} defaultChecked={columnSize === 4} />
                                                <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="col4RadioBtn" onClick={() => onClickColumnSizeButton(4)}>4</label>

                                                <input type="radio" className="btn-check" name="columnSize" id="col5RadioBtn" value="5" disabled={isDisabled} defaultChecked={columnSize === 5} />
                                                <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="col5RadioBtn" onClick={() => onClickColumnSizeButton(5)}>5</label>

                                                <input type="radio" className="btn-check" name="columnSize" id="col6RadioBtn" value="6" disabled={isDisabled} defaultChecked={columnSize === 6} />
                                                <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="col6RadioBtn" onClick={() => onClickColumnSizeButton(6)}>6</label>
                                            </div>
                                        </Col>
                                        <Col md={8}>
                                            <div>Product Layout Type</div>
                                            <div className="btn-group" role="group">
                                                {viewType === 'grid' && <>
                                                    <input type="radio" className="btn-check" name="productLayoutType" id="productLayoutTypeA" defaultChecked={layoutType === '1'} />
                                                    <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="productLayoutTypeA" onClick={() => onClickLayoutTypeButton('1')}>
                                                        {/* A */}
                                                        <img src='https://storage.googleapis.com/ourstore-bucket/grid%20a%20transparent.svg' style={{ height: '10rem' }}></img>
                                                    </label>
                                                </>}
                                                {viewType === 'list' && <>
                                                    <input type="radio" className="btn-check" name="productLayoutType" id="productLayoutTypeA" defaultChecked={layoutType === '3'} />
                                                    <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="productLayoutTypeA" onClick={() => onClickLayoutTypeButton('3')}>
                                                        {/* A */}
                                                        <img src='https://storage.googleapis.com/ourstore-bucket/list%20a%20transparent.svg' style={{ height: '8rem' }}></img>
                                                    </label>
                                                </>}

                                                {viewType === 'grid' && <>
                                                    <input type="radio" className="btn-check" name="productLayoutType" id="productLayoutTypeB" defaultChecked={layoutType === '2'} />
                                                    <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="productLayoutTypeB" onClick={() => onClickLayoutTypeButton('2')}>
                                                        {/* B */}
                                                        <img src='https://storage.googleapis.com/ourstore-bucket/grid%20b%20transparent.svg' style={{ height: '10rem' }}></img>
                                                    </label>
                                                </>}

                                                {viewType === 'list' && <>
                                                    <input type="radio" className="btn-check" name="productLayoutType" id="productLayoutTypeB" defaultChecked={layoutType === '4'} />
                                                    <label style={{ '--bs-btn-color': themeData.secondary, '--bs-btn-border-color': themeData.secondary, '--bs-btn-active-bg': themeData.secondary, '--bs-btn-active-border-color': themeData.secondary }} className="btn btn-outline-primary" htmlFor="productLayoutTypeB" onClick={() => onClickLayoutTypeButton('4')}>
                                                        {/* B */}
                                                        <img src='https://storage.googleapis.com/ourstore-bucket/list%20b%20transparent.svg' style={{ height: '8rem' }}></img>
                                                    </label>
                                                </>}
                                            </div>
                                        </Col>
                                    </Row>

                                    <Container fluid className="button-right">
                                        <Button variant="none" style={{ backgroundColor: themeData.secondary, color: 'white' }} onClick={handleSaveLayoutTheme}>Save Changes</Button>
                                    </Container>
                                </Container>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <br></br>

                    <Container fluid className="button-right">
                        <Button variant="light" style={{ backgroundColor: themeData.primary, color: 'white' }} onClick={() => setAddProductModalShow(true)}>
                            Add Product
                        </Button>
                    </Container>


                    <AddProduct
                        themeData={themeData}
                        show={addProductModalShow}
                        onHide={() => setAddProductModalShow(false)}
                    />
                </div>
                }

                <GridContainerLayout viewType={viewType} columnSize={columnSize} products={products} layoutType={layoutType} />
                <ListContainerLayout viewType={viewType} products={products} layoutType={layoutType} />
            </Container>
            <Footer />
        </div>
    )


}

export default Products;