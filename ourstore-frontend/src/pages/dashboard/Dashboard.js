import Cookies from 'js-cookie';
import axios from 'axios';
import { Container, Row, Col, Card, Modal, Button, Table } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from '../../App.js';
import Header from '../../components/Header.js';

import { fetchTheme } from "../../redux/reducers/themeSlice";
import { fetchMetrics } from "../../redux/reducers/mectricsSlice";
import './Dashboard.module.css'
import Footer from '../../components/Footer.js';
import './Dashboard.css'
import '../landingPage/LandingPage.css';

const Dashboard = () => {
    const jwt = Cookies.get('jwt');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // apply theme
    const themes = useSelector(state => state.theme)
    const themeData = themes.theme[0]

    const mectrics = useSelector(state => state.mectrics)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [dailyVisits, setDailyVisits] = useState('0');
    const [productSold, setProductSold] = useState('0');
    const [totalRevenue, setTotalRevenue] = useState('0');
    const [totalUser, setTotalUser] = useState('0');
    const [user, setUser] = useState(null);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);

    const handleShowModal1 = () => {
        setShowModal1(true);
    };

    const handleCloseModal1 = () => {
        setShowModal1(false);
    };

    const handleShowModal2 = () => {
        setShowModal2(true);
    };

    const handleCloseModal2 = () => {
        setShowModal2(false);
    };

    const handleShowModal3 = () => {
        setShowModal3(true);
    };

    const handleCloseModal3 = () => {
        setShowModal3(false);
    };

    useEffect(() => {
        if (!jwt) navigate('/login');

        const fetchData = async () => {
            await dispatch(fetchTheme());
            const result = await dispatch(fetchMetrics());
            setDailyVisits(result.payload[0].dailyActiveUser);
            setProductSold(result.payload[0].productSoldPerMonth);
            setTotalRevenue(result.payload[0].revenuePerMonth);
            setTotalUser("N/A");
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        // if (!jwt) navigate('/login');
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
                        setUser(res.data);
                    })
            })
            .catch((err) => {
                setUser(null);
                navigate('/login');
            });

    }, [])

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(totalRevenue);

    // handle redux reducers
    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    const handleBuyProduct = async (event) => {
        event.preventDefault();

        const jwt = Cookies.get('jwt');
        let sessionUrl = null;

        await axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/products/63ebaf213f25c0c131b45c2d/checkout-session`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                sessionUrl = res.data.session.url;
                console.log(sessionUrl);
            })
            .catch((err) => console.log(err));

        if (sessionUrl) {
            window.location.href = sessionUrl;
        }

    }

    return (
        <div className='wrapper'>
            <Header />
            <Container fluid className='p-0 m-0 content'>
                <div className='m-4'>
                    {user && <h3>Hello, {user.username}</h3>}
                    <Row className='mt-4'>
                        <Col md={4}>
                            <Card
                                onClick={handleShowModal1}
                                bg="light"
                                key="Light"
                                text='dark'
                                className="custom-border shadow mb-4"
                                style={{ borderColor: themeData.primary }}>
                                <div className="row h-100">
                                    <div className="col-md-4">
                                        <Card.Img style={{ padding: '2rem' }} src="https://storage.googleapis.com/ourstore-bucket/681494.png" alt="Card image" />
                                    </div>
                                    <div className="col-md-8 d-flex justify-content-center align-items-center">
                                        <Card.Body className='text-center'>
                                            <Card.Title style={{ fontSize: '1.5rem' }}>{dailyVisits}</Card.Title>
                                            <Card.Text className='fontItem'>
                                                Daily Visit
                                            </Card.Text>
                                        </Card.Body>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card
                                onClick={handleShowModal2}
                                bg="light"
                                key="Light"
                                text='dark'
                                className="custom-border shadow mb-4"
                                style={{ borderColor: themeData.primary }}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <Card.Img style={{ padding: '2rem' }} src="https://storage.googleapis.com/ourstore-bucket/sell-icon-png-17-removebg-preview.png" alt="Card image" />
                                    </div>
                                    <div className="col-md-8 d-flex justify-content-center align-items-center">
                                        <Card.Body className='text-center'>
                                            <Card.Title style={{ fontSize: '1.5rem' }}>{productSold}</Card.Title>
                                            <Card.Text className='fontItem'>
                                                Products Sold This Month
                                            </Card.Text>
                                        </Card.Body>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card
                                onClick={handleShowModal3}
                                bg="light"
                                key="Light"
                                text='dark'
                                className="custom-border shadow mb-4"
                                style={{ borderColor: themeData.primary }}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <Card.Img style={{ padding: '2rem' }} src="https://storage.googleapis.com/ourstore-bucket/66490.png" alt="Card image" />
                                    </div>
                                    <div className="col-md-8 d-flex justify-content-center align-items-center">
                                        <Card.Body className='text-center'>
                                            <Card.Title style={{ fontSize: '1.5rem' }}>{formattedPrice}</Card.Title>
                                            <Card.Text className='fontItem'>
                                                Total Revenue This Month
                                            </Card.Text>
                                        </Card.Body>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

            </Container >

            <Modal size="lg" show={showModal1} onHide={handleCloseModal1}>
                <Modal.Header closeButton>
                    <Modal.Title>Daily Visit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Number of daily visit : {dailyVisits}</strong>
                    <br /><br />
                    <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key="1">
                                    <td>Guest 999</td>
                                    <td>22:45:42.34</td>
                                </tr>
                                <tr key="2">
                                    <td>Guest 998</td>
                                    <td>22:45:41.12</td>
                                </tr>
                                <tr key="1">
                                    <td>Guest 997</td>
                                    <td>22:45:42.31</td>
                                </tr>
                                <tr key="2">
                                    <td>Guest 996</td>
                                    <td>22:45:40.12</td>
                                </tr>
                                <tr key="1">
                                    <td>destin</td>
                                    <td>22:36:42.34</td>
                                </tr>
                                <tr key="2">
                                    <td>mj</td>
                                    <td>22:35:41.12</td>
                                </tr>
                                <tr key="1">
                                    <td>Guest 995</td>
                                    <td>22:22.34.56</td>
                                </tr>
                                <tr key="2">
                                    <td>Guest 994</td>
                                    <td>22:12:45.12</td>
                                </tr>
                                <tr key="1">
                                    <td>Guest 993</td>
                                    <td>21:50:42.34</td>
                                </tr>
                                <tr key="2">
                                    <td>Guest 992</td>
                                    <td>21:47:41.12</td>
                                </tr>
                                <tr key="1">
                                    <td>Guest 991</td>
                                    <td>21:45:42.34</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal size="lg" show={showModal2} onHide={handleCloseModal2}>
                <Modal.Header closeButton>
                    <Modal.Title>Product Sold This Month</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Number of products sold : {productSold}</strong>
                    <br /><br />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Sold Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key="1">
                                <td>Selis</td>
                                <td>67</td>
                            </tr>
                            <tr key="2">
                                <td>Santa Cruz</td>
                                <td>56</td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            <Modal size="lg" show={showModal3} onHide={handleCloseModal3}>
                <Modal.Header closeButton>
                    <Modal.Title>Total Revenue This Month</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Total Revenue This Month : {formattedPrice}</strong>
                    <br /><br />
                    <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Invoice No</th>
                                    <th>Quantity</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key="1">
                                    <td>destin</td>
                                    <td>Selis</td>
                                    <td>INV01000</td>
                                    <td>2</td>
                                    <td>Rp 5.600.000</td>
                                </tr>
                                <tr key="2">
                                    <td>mj</td>
                                    <td>Santa Cruz</td>
                                    <td>INV00999</td>
                                    <td>2</td>
                                    <td>Rp 6.880.000</td>
                                </tr>
                                <tr key="2">
                                    <td>mikhael</td>
                                    <td>Santa Cruz</td>
                                    <td>INV00998</td>
                                    <td>3</td>
                                    <td>Rp 10.320.000</td>
                                </tr>
                                <tr key="2">
                                    <td>Ricky</td>
                                    <td>Selis</td>
                                    <td>INV00997</td>
                                    <td>1</td>
                                    <td>Rp 2.800.000</td>
                                </tr>
                                <tr key="2">
                                    <td>joanny</td>
                                    <td>Selis</td>
                                    <td>INV00996</td>
                                    <td>1</td>
                                    <td>Rp 2.800.000</td>
                                </tr>
                                <tr key="2">
                                    <td>Ricky</td>
                                    <td>Selis</td>
                                    <td>INV00997</td>
                                    <td>1</td>
                                    <td>Rp 2.800.000</td>
                                </tr>
                                <tr key="2">
                                    <td>Antonius</td>
                                    <td>Santa Cruz</td>
                                    <td>INV00995</td>
                                    <td>1</td>
                                    <td>Rp 3.440.000</td>
                                </tr>
                                <tr key="2">
                                    <td>Jonathan</td>
                                    <td>Selis</td>
                                    <td>INV00994</td>
                                    <td>3</td>
                                    <td>Rp 8.400.000</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
            </Modal>
            <Footer className="footer" />
        </div >
    )
}

export default Dashboard;