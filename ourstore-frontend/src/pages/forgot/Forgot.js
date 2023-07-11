import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";
import { fetchTheme } from "../../redux/reducers/themeSlice";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

const Forgot = () => {

    const dispatch = useDispatch();
    const logo = useSelector(state => state.theme).theme[0];

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const [enteredEmail, setEnteredEmail] = useState('');
    const [textMsg, setTextMsg] = useState('');

    const emailChangedHandler = (event) => {
        setEnteredEmail(event.target.value);
    }

    const forgotHandler = (event) => {
        event.preventDefault();
        setTextMsg("Loading....");


        if (enteredEmail.length === 0) {
            setTextMsg("Please input your email")
        }
        else {
            axios.post(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/pass/forgot`, {
                email: enteredEmail
            }, {
                withCredentials: true
            })
                .then(() => {
                    setTextMsg('The reset password procedure has sent to your email. Please check your email inbox');
                })
                .catch((err) => {
                    setTextMsg(err.response.data.message);
                });
        }
    }

    useEffect(() => {
        dispatch(fetchTheme())
        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [])

    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    return (
        <>
            {logo && logo.logoLink &&
                <Container fluid>
                    <Row style={{ height: '100vh' }}>
                        <Col md={6} className="d-flex flex-column justify-content-between" style={{ padding: '6rem' }}>
                            <div class='left'>
                                <Image alt='logo' className="mb-4" style={{ height: '50px', objectFit: 'contain', float: 'left' }} src={logo.logoLink} />
                            </div>
                            <h1>Forgot Password</h1>
                            <h6 style={{ color: 'gray' }}>Input your email and we will send you reset password link.</h6>
                            <Form onSubmit={forgotHandler} className="mt-2">
                                <Form.Group controlId="formBasicEmail" className="mb-4">
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </InputGroup.Text>
                                        <Form.Control type="email" placeholder="Email" style={{ padding: '.75rem' }} onChange={emailChangedHandler} value={enteredEmail} />
                                    </InputGroup>
                                </Form.Group>

                                <p style={{ color: 'red' }}>{textMsg}</p>

                                <Button variant="light" style={{ width: '100%', padding: '.75rem', fontSize: '1.1rem', backgroundColor: themeData.primary, color: 'white' }} type="submit" className="mb-4 mt-2">
                                    Send
                                </Button>
                            </Form>
                            <p>Remember your account? <a href="/login">Log in</a></p>
                        </Col>
                        <Col style={{ backgroundColor: themeData.primary }} md={6} className="d-none d-md-block"></Col>
                    </Row>
                </Container>
            }
        </>
    );
};

export default Forgot;
