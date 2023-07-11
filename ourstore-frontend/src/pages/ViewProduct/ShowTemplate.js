import './ShowTemplate.css';
import { Button, Container, Row, Col, Carousel, Image, Tabs, Tab } from "react-bootstrap";
import ReactImageMagnify from 'react-image-magnify';
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from '../../App';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ShowTemplate = (props) => {

    const navigate = useNavigate();

    let themeData = props.themeData
    let listproducts = props.listproducts
    let crnTemplate = props.template
    let showAdmin = props.showAdmin
    let id = props.id
    let output = ""

    const [selectedImage, setSelectedImage] = useState(listproducts.images[0]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    useEffect(() => {
        // console.log(listproducts.images[0])
        setSelectedImage(listproducts.images[0])
        // console.log(selectedImage)
    }, [id])

    const handleBuyProduct = async (event) => {
        event.preventDefault();

        const jwt = Cookies.get('jwt');
        if (!jwt) navigate('/login');

        let sessionUrl = null;

        if (jwt) {
            await axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/products/${id}/checkout-session`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
                .then((res) => {
                    sessionUrl = res.data.session.url;
                })
                .catch((err) => {
                    alert(err)
                });

            if (sessionUrl) {
                window.location.href = sessionUrl;
            }
        }
    }

    if (crnTemplate === 1) {
        output =
            <Row style={{ display: 'flex' }}>
                <Col md={5} className='p-3 d-flex' >
                    <Carousel fade
                        variant="dark"
                        className='carousel-indicators-dots align-self-stretch align-items-center'
                        style={{ width: '100%' }}>
                        {Object.keys(listproducts.images).map((key) => (
                            <Carousel.Item key={key} className='p-5'>
                                <Image style={{ width: '100%', height: '100%' }}
                                    className="p-2"
                                    src={`${listproducts.images[key].imageLink}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
                <Col md={7} className='p-3'>
                    <div className=''>
                        <h3 className='mb-3'>{listproducts.name}</h3>
                        <h2 className='mb-5'>Rp {listproducts.price.toLocaleString('id-ID')}</h2>
                        <Button variant="light" style={{ width: '100%', backgroundColor: themeData.primary, color: 'white' }} className='p-2 mb-5' onClick={handleBuyProduct} disabled={showAdmin}>
                            Buy Product
                        </Button>
                        <h6 className='mb-3' style={{ color: 'gray' }}>{listproducts.description}</h6>
                    </div>
                </Col>
            </Row>
        // </Container>
    }

    else if (crnTemplate === 2) {
        output =
            <Row style={{ display: 'flex' }}>
                <Col md={5} className='p-3'>
                    <div className='d-flex flex-column justify-content-between h-100'>
                        <div>
                            <Row sm={2}>
                                <Col >
                                    <h3 className='mb-3'>{listproducts.name}</h3>
                                    <h2 className='mb-5'>Rp {listproducts.price.toLocaleString('id-ID')}</h2>
                                </Col>
                                <Col className='align-items-center'>
                                    <Button variant="light" style={{ width: '100%', backgroundColor: themeData.primary, color: 'white' }} className='p-2' onClick={handleBuyProduct} disabled={showAdmin}>
                                        Buy Product
                                    </Button>
                                </Col>

                            </Row>
                            <hr></hr>
                            <h6 className='mt-5' >Description</h6>
                            <h7 className='mt-5 mb-3' style={{ color: 'gray' }}>{listproducts.description}</h7>
                        </div>
                    </div>
                </Col>
                <Col md={7} className='p-3 d-flex flex-column'>
                    <Row>
                        <Col md={2}>
                            <Row>
                                {Object.keys(listproducts.images).map((key) => (
                                    <Col xs={6} md={12} key={key} className='mb-1'>
                                        <Image
                                            onClick={() => handleImageClick(listproducts.images[key])}
                                            fluid
                                            src={`${listproducts.images[key].imageLink}`}
                                            className='img-hover-effect'
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                        <Col md={10}>
                            <Image
                                // className="imgSlide"
                                style={{ width: '100%', aspectRatio: '1 / 1' }}
                                src={`${selectedImage.imageLink}`}
                            />
                        </Col>
                    </Row>
                </Col >
            </Row >
    }

    else {
        output =
            <>
                <Row md={3} className="text-center align-items-center">
                    <Col md={3} className="h-100">
                        <h3 className='mb-3'><b>{listproducts.name.toUpperCase()}</b></h3>
                    </Col>
                    <Col md={6}>
                        <Image
                            // className="imgSlide"
                            style={{ width: '80%', aspectRatio: '1 / 1' }}
                            src={`${selectedImage.imageLink}`}
                            className='mb-4'
                        />
                        <Row md={6} className='d-flex justify-content-center text-center'>
                            {Object.keys(listproducts.images).map((key) => (
                                <Col key={key}>
                                    <Image
                                        onClick={() => handleImageClick(listproducts.images[key])}
                                        fluid
                                        src={`${listproducts.images[key].imageLink}`}
                                        className='img-hover-effect'
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col md={3} className="h-100">
                        <h5>Rp {listproducts.price.toLocaleString('id-ID')}</h5>
                        <Button variant="light" style={{ width: '60%', backgroundColor: themeData.primary, color: 'white' }} className='p-2 mt-4' onClick={handleBuyProduct} disabled={showAdmin}>
                            Buy Product
                        </Button>
                    </Col>
                </Row>
                <Container fluid className='mt-5 text-center'>

                    <strong>DESCRIPTION</strong>
                    <p className='mt-5'>{listproducts.description}</p>
                </Container>
            </>
    }

    return (
        <Container fluid className='mt-4 p-3'>
            {output}
        </Container>
    )
}

export default ShowTemplate;
