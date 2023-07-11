import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";
import { fetchTheme } from "../../redux/reducers/themeSlice";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons'

import classes from './SignUp.module.css';

const SignUp = () => {

    const dispatch = useDispatch();
    const logo = useSelector(state => state.theme).theme[0];
    const navigate = useNavigate();

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPass, setEnteredPass] = useState('');
    const [enteredConfirmPass, setEnteredConfirmPass] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        dispatch(fetchTheme())
        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [])

    const emailChangedHandler = (event) => {
        setEnteredEmail(event.target.value);
    }

    const usernameChangedHandler = (event) => {
        setEnteredUsername(event.target.value);
    }

    const passwordChangedHandler = (event) => {
        setEnteredPass(event.target.value);
    }

    const confirmPasswordChangedHandler = (event) => {
        setEnteredConfirmPass(event.target.value);
    }

    const signUpHandler = (event) => {
        event.preventDefault();

        if (enteredEmail.length === 0 && enteredUsername.length === 0 && enteredConfirmPass.length === 0 && enteredPass.length === 0) {
            setErrorMsg('Email, username, and password are required');
            return;
        }

        if (enteredPass !== enteredConfirmPass) {
            setErrorMsg('Password and confirm password are not the same');
            return;
        };

        axios.post(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/`, {
            email: enteredEmail,
            username: enteredUsername,
            password: enteredPass,
        }, {
            withCredentials: true
        }).then(() => {
            navigate(`/otp`);
        }).catch((err) => {
            console.log(err.response.data)
            setErrorMsg(err.response.data.message);
            setIsButtonDisabled(false);
            setEnteredEmail('');
            setEnteredUsername('');
            setEnteredPass('');
            setEnteredConfirmPass('');
        });

        setErrorMsg("Loading");
        setIsButtonDisabled(true);
    }

    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    return (
        <>
            {logo && logo.logoLink &&
                <Container fluid>
                    <Row style={{ height: '100vh' }}>
                        <Col style={{ backgroundColor: themeData.primary }} md={6} className="d-none d-md-block"></Col>
                        <Col md={6} className="d-flex flex-column justify-content-between" style={{ padding: '3rem', paddingLeft: '5rem', paddingRight: '5rem' }}>
                            <div class='left'>
                                <Image alt='logo' className="mb-4" style={{ height: '50px', objectFit: 'contain', float: 'left' }} src={logo.logoLink} />
                            </div>
                            <h1>Sign up.</h1>
                            <Form onSubmit={signUpHandler} className="mt-2">
                                <Form.Group controlId="formBasicEmail" className="mb-4">
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </InputGroup.Text>
                                        <Form.Control type="email" placeholder="Email" style={{ padding: '.75rem' }} onChange={emailChangedHandler} value={enteredEmail} />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="formBasicUsername" className="mb-4">
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FontAwesomeIcon icon={faUser} />
                                        </InputGroup.Text>
                                        <Form.Control type="text" placeholder="Username" style={{ padding: '.75rem' }} onChange={usernameChangedHandler} value={enteredUsername} />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mb-4">
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FontAwesomeIcon icon={faLock} />
                                        </InputGroup.Text>
                                        <Form.Control type="password" placeholder="Password" style={{ padding: '.75rem' }} onChange={passwordChangedHandler} value={enteredPass} />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="formBasicReconfirmPassword" className="mb-2">
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FontAwesomeIcon icon={faLock} />
                                        </InputGroup.Text>
                                        <Form.Control type="password" placeholder="Confirm Password" style={{ padding: '.75rem' }} onChange={confirmPasswordChangedHandler} value={enteredConfirmPass} />
                                    </InputGroup>
                                </Form.Group>

                                <p style={{ color: 'red' }}>{errorMsg}</p>
                                <Button variant="light" style={{ width: '100%', padding: '.75rem', fontSize: '1.1rem', backgroundColor: themeData.primary, color: 'white' }} type="submit" className={`mb-4 mt-2 ${isButtonDisabled ? classes.disabled : ''}`}>
                                    Sign Up
                                </Button>
                            </Form>
                            <p>Already have an account? <a href="/login">Log in</a></p>
                        </Col>
                    </Row>
                </Container>
            }
        </>
    );
};

export default SignUp;
