import { Button, Container, Row, Col, Card, Accordion, Alert, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTheme, updateTheme } from "../../redux/reducers/themeSlice";
import { fetchSingleProduct } from "../../redux/reducers/singleproductSlice";
import './ViewProduct.css';
import ShowTemplate from "./ShowTemplate";
import DeleteProduct from "./DeleteProduct";
import EditProduct from "./EditProduct";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from '../../App';

import axios from 'axios';
import Cookies from 'js-cookie';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { toast, ToastContainer } from "react-toastify";

const ViewProducts = () => {
    const { id } = useParams();
    const jwt = Cookies.get('jwt');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const products = useSelector(state => state.singleProduct);
    const loadinghandle = products.loading;
    const errorhandle = products.error;
    const listproducts = products.products;

    const [showAdmin, setShowAdmin] = useState(false);
    const [template, setTemplate] = useState("");
    const [showDeleteProduct, setShowDeleteProduct] = useState(false);
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [editSuccessToast, setEditSuccessToast] = useState(false);
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

    if (editSuccessToast) {
        const fetchData = async () => {
            await dispatch(fetchSingleProduct(id));
            setSuccessMsg({ isShown: true, msg: 'Product updated successfully' });
        };
        fetchData();
        setEditSuccessToast(false);
    }

    useEffect(() => {
        axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/jwt/check`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                if (res.data.data.user.role === 'admin') setShowAdmin(true)
            })
            .catch((err) => console.log(err));

        const fetchData = async () => {
            await dispatch(fetchSingleProduct(id));
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
            const templateId = parseInt(result.payload[0].singleProductTemplateId)
            setTemplate(templateId)
        };
        fetchData();

        if (errorhandle) {
            console.log(errorhandle)
            navigate('/products')
        }
    }, [dispatch, errorhandle]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await dispatch(fetchSingleProduct(id));
    //     };
    //     fetchData();
    //     console.log("edit " + editSuccessToast)
    //     // if (editSuccessToast) {
    //     // console.log("aaa")
    //     // setSuccessMsg({ isShown: true, msg: 'Product updated successfully' });
    //     // setEditSuccessToast(false)
    // }, [editSuccessToast]);

    const onClickLayoutCrnTemplate = (props) => {
        setTemplate(props);
    }

    const onClickShowDeleteProduct = (props) => {
        setShowDeleteProduct(props);
    }

    const onClickShowEditProduct = (props) => {
        setShowEditProduct(props);
    }

    // handle empty products
    if (loadinghandle) {
        return <div>Loading...</div>;
    }
    if (listproducts.length === 0 || themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    const handleSaveLayoutTheme = async (e) => {
        e.preventDefault();
        let raw = {
            "logoLink": themeData.logoLink,
            "primary": themeData.primary,
            "secondary": themeData.secondary,
            "templateId": themeData.templateId,
            "columnSize": themeData.columnSize,
            "viewType": themeData.viewType,
            "singleProductTemplateId": template.toString()
        };
        console.log(raw)
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
                {/* <ToastContainer
                    position='top-center'
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    theme='colored'
                /> */}
                <div className="p-3" hidden={!showAdmin}>
                    <Accordion defaultActiveKey={0}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header style={{ '--accordion-buttton-not-collapsed': `rgba(${r}, ${g}, ${b}, 0.45)`, '--accordion-buttton-collapsed': themeData.secondary }}>Layout Settings</Accordion.Header>
                            <Accordion.Body>
                                <Container fluid className="p-0">
                                    <Row sm={3}>
                                        <Col>
                                            <Card className="cardTemplate"
                                                onClick={() => onClickLayoutCrnTemplate(1)}
                                                role="button"
                                                style={{
                                                    '--template-hover': `rgba(${r}, ${g}, ${b}, 0.45)`,
                                                    borderColor: template === 1 ? themeData.secondary : '',
                                                    backgroundColor: template === 1 ? themeData.secondary : ''
                                                }}>
                                                <Card.Body className="text-center">
                                                    <img src='https://storage.googleapis.com/ourstore-bucket/template%201.svg' style={{ height: '10rem' }}></img>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="cardTemplate"
                                                onClick={() => onClickLayoutCrnTemplate(2)}
                                                role="button"
                                                style={{
                                                    '--template-hover': `rgba(${r}, ${g}, ${b}, 0.45)`,
                                                    borderColor: template === 2 ? themeData.secondary : '',
                                                    backgroundColor: template === 2 ? themeData.secondary : '',
                                                }}>
                                                <Card.Body className="text-center">
                                                    <img src='https://storage.googleapis.com/ourstore-bucket/template%202.svg' style={{ height: '10rem' }}></img>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="cardTemplate"
                                                onClick={() => onClickLayoutCrnTemplate(3)}
                                                role="button"
                                                style={{
                                                    '--template-hover': `rgba(${r}, ${g}, ${b}, 0.45)`,
                                                    borderColor: template === 3 ? themeData.secondary : '',
                                                    backgroundColor: template === 3 ? themeData.secondary : ''
                                                }}>
                                                <Card.Body className="text-center">
                                                    <img src='https://storage.googleapis.com/ourstore-bucket/template%203.svg' style={{ height: '10rem' }}></img>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Container fluid className="button-right mt-3">
                                        <Button variant="light" style={{ backgroundColor: themeData.secondary, color: 'white' }} onClick={handleSaveLayoutTheme}>Save Changes</Button>
                                    </Container>
                                </Container>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <Container fluid hidden={!showAdmin} className="mt-3 mb-3 d-flex justify-content-end">
                        <Button variant="light" style={{ marginRight: '0.5rem', backgroundColor: themeData.primary, color: 'white' }} onClick={() => onClickShowEditProduct(true)}>
                            Edit Product
                        </Button>
                        <Button variant="danger" style={{ color: 'white' }} onClick={() => onClickShowDeleteProduct(true)}>
                            Delete Product
                        </Button>
                    </Container>
                    <EditProduct themeData={themeData} show={showEditProduct} id={id} listproducts={listproducts} onHide={() => onClickShowEditProduct(false)} alertSuccessToast={() => setEditSuccessToast(true)} />
                    <DeleteProduct show={showDeleteProduct} id={id} onHide={() => onClickShowDeleteProduct(false)} />
                </div>
                <ShowTemplate id={id} template={template} listproducts={listproducts} showAdmin={showAdmin} themeData={themeData} />
            </Container>
            <Footer />
        </div>
    )
}

export default ViewProducts;