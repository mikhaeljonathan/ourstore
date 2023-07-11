import { Button, Container, Row, Col, Figure, Modal, Form, Toast, Spinner, Image, FormFile } from "react-bootstrap";
import { SketchPicker } from 'react-color';
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTheme, updateTheme, uploadLogo } from "../../redux/reducers/themeSlice";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from '../../App';
import axios from 'axios';
import './Theme.css';
import EditLogo from "./EditLogo";
import Cookies from 'js-cookie';
import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import { toast, ToastContainer } from "react-toastify";


const Theme = () => {
    const jwt = Cookies.get('jwt');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });
    const fileInput = useRef(null);

    const [logo, setLogo] = useState();
    const [colorPrim, setColorPrim] = useState('#ffffff');
    const [colorSec, setColorSec] = useState('#ffffff');
    const [templateId, setTemplateId] = useState('1');
    const [viewType, setViewType] = useState('list');
    const [columnSize, setColumnSize] = useState('3');
    const [singleProductTemplateId, setSingleProductTemplateId] = useState('1');

    const [showEditLogo, setShowEditLogo] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });

    useEffect(() => {
        if (!jwt) navigate('/login');
        // check admin
        // axios.get(`http://localhost:5000/api/v1/users/jwt/check`, {
        //     withCredentials: true,
        //     headers: {
        //         Authorization: `Bearer ${jwt}`
        //     }
        // })
        //     .then((res) => {
        //         setCrnUser(res.data.data.user.role)
        //         if (crnUser === 'admin') setShowAdmin(true)
        //     })
        //     .catch((err) => console.log(err));
        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
            setLogo(result.payload[0].logoLink);
            setColorPrim(result.payload[0].primary);
            setColorSec(result.payload[0].secondary);
            setTemplateId(result.payload[0].templateId);
            setViewType(result.payload[0].viewType)
            setColumnSize(result.payload[0].columnSize);
            setSingleProductTemplateId(result.payload[0].singleProductTemplateId);
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (successMsg.isShown) {
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])

    // handle empty theme
    if (theme.theme.length === 0) {
        return <Spinner animation="border" />;
    }

    const toggleShowAlert = () => setShowAlert(!showAlert);


    const handleSave = async () => {
        toggleShowAlert();
        let raw = {
            "logoLink": logo,
            "primary": colorPrim,
            "secondary": colorSec,
            "templateId": templateId,
            "columnSize": columnSize,
            "viewType": viewType,
            "singleProductTemplateId": singleProductTemplateId
        };

        let res = await dispatch(updateTheme(raw))
        if (res === 'success') {
            setSuccessMsg({ isShown: true, msg: 'Theme updated successfully' });
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    const UploadLogo = (event) => {
        const formData = new FormData();
        formData.append('image', event.target.files[0])

        axios.post(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/themes/logo`, formData, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).then(async (res) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            handleChangeLogo(res.data.data);
            // alert("success upload")
        }).catch((err) => {

        });
    }

    const handleChangeLogo = (props) => {
        setLogo(props);
    }

    const handleChangePrim = (selectedColor) => {
        setColorPrim(selectedColor.hex);
    };
    const handleChangeSec = (selectedColor) => {
        setColorSec(selectedColor.hex);
    };

    const onClickShowEditLogo = (props) => {
        setShowEditLogo(props);
    }

    const handleClick = (props) => {
        setShowEditLogo(true);
        fileInput.current.click();
    };

    const r = parseInt(themeData.secondary.substring(1, 3), 16);
    const g = parseInt(themeData.secondary.substring(3, 5), 16);
    const b = parseInt(themeData.secondary.substring(5, 7), 16);

    return (
        <div className="wrapper">
            <Header />
            <Container fluid className="p-0 m-0 content">
                <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: themeData.secondary, height: '15vh' }}>
                    <h4>Customize Your Branding</h4>
                </div>
                <div className="m-4">
                    <h6>Upload Logo</h6>
                    <div className="d-flex">
                        <Image className="mr-4 border"
                            style={{
                                width: "12rem",
                                height: "12rem",
                            }}
                            src={logo}
                            alt='logo'
                            fluid
                        />
                        <Col className="m-4 mt-0">
                            <Button variant="light" style={{ backgroundColor: themeData.primary, color: 'white' }} onClick={handleClick}>Change Logo</Button>
                            <input
                                type="file"
                                ref={fileInput}
                                style={{ display: 'none' }}
                                onChange={UploadLogo}
                                accept="image/*"
                            />
                        </Col>
                    </div>

                </div>
                <div className="m-5"></div>
                <div className="m-4">
                    <h6>Theme Color</h6>
                    <p style={{ color: 'gray' }}>Choose the color of your theme. This color will determine the color of buttons, highlight, hover effects and so on.</p>

                    <div className="mt-3">
                        <Row>
                            <Col md={4}>
                                <p>Primary</p>
                                <SketchPicker color={colorPrim} onChange={handleChangePrim} />
                            </Col>
                            <Col md={4}>
                                <p>Secondary</p>
                                <SketchPicker color={colorSec} onChange={handleChangeSec} />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="m-5"></div>
                <div className="m-4">
                    <Button variant="light" style={{ backgroundColor: themeData.primary, color: 'white' }} onClick={(handleSave)}>Save Changes</Button>
                </div>
                <ToastContainer
                    position='top-center'
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    theme='colored'
                />
            </Container>
            {/*<Container fluid className="contnr mb-0">
                <Row>
                    <Col md="auto">
                        <h1>Logo</h1>
                    </Col>
                    <Col className="d-flex" md="auto">
                        <Button onClick={() => onClickShowEditLogo(true)} className="btn">Change Logo</Button>
                    </Col>
                </Row>
                <Row md="auto p-3">
                    <Figure className="border p-2">
                        <Figure.Image
                            width={150}
                            height={150}
                            src={logo}
                        />
                    </Figure>
                </Row>
            </Container>


            <Container fluid className="contnr">
                <Row>
                    <Col md="auto">
                        <h1>Color</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md="auto">
                        <h2>Primary</h2>
                        <SketchPicker color={colorPrim} onChange={handleChangePrim} />
                    </Col>
                    <Col md="auto">
                        <h2>Secondary</h2>
                        <SketchPicker color={colorSec} onChange={handleChangeSec} />
                    </Col>
                </Row>
                <Row>
                    <Col className="pt-3">
                        <Button onClick={(handleSave)}>Save Changes</Button>
                        <Toast show={showAlert} onClose={toggleShowAlert} delay={3000} autohide>
                            <Toast.Header>
                                <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded me-2"
                                    alt=""
                                />
                                <strong className="me-auto">Saved</strong>
                            </Toast.Header>
                            <Toast.Body>You just saved changes</Toast.Body>
                        </Toast>
                    </Col>
                </Row>
            </Container> */}

            {/* <EditLogo show={showEditLogo} onChange={UploadLogo} onHide={() => onClickShowEditLogo(false)} /> */}
            <Footer className='footer' />
        </div>
    )
}

export default Theme;