import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";
import { fetchTheme } from "../../redux/reducers/themeSlice";
import queryString from 'query-string';
import Cookies from "js-cookie";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'

const Login = () => {

    const dispatch = useDispatch();
    const logo = useSelector(state => state.theme).theme[0];
    const navigate = useNavigate();
    const location = useLocation();
    const values = queryString.parse(location.search);
    const jwt = Cookies.get('jwt');

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPass, setEnteredPass] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        dispatch(fetchTheme())
        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [])

    // if the user logged in, dont need to prompt email and password
    useEffect(() => {
        if (!jwt) return;

        axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/jwt/check`, {
            // axios.get(`http://127.0.0.1:5000/api/v1/users/jwt/check`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                if (values.goto) navigate(`/${values.goto}`)
                else navigate(`${res.data.data.user.role === 'admin' ? '/dashboard' : '/products'}`);
            })
            .catch((err) => console.log(err));
    }, [navigate, jwt, values.goto]);

    const usernameChangedHandler = (event) => {
        setEnteredUsername(event.target.value);
    }

    const passwordChangedHandler = (event) => {
        setEnteredPass(event.target.value);
        return;
    }

    const loginHandler = (event) => {
        event.preventDefault();
        if (enteredPass.length === 0 || enteredUsername === 0) {
            setErrorMsg('Incorrect Email and Password');
            return;
        }
        axios.post(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/login`, {
            email: enteredUsername,
            password: enteredPass
        }, {
            withCredentials: true
        }).then((res) => {
            if (values.goto) navigate(`/${values.goto}`)
            else navigate(`${res.data.data.user.role === 'admin' ? '/dashboard' : '/products'}`);
        }).catch(err => {
            setErrorMsg(err.response.data.message);
            setEnteredUsername('');
            setEnteredPass('');
        });
    }

    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    return (
        <>
            {logo && logo.logoLink &&
                <Container fluid>
                    <Row style={{ height: '100vh' }}>
                        <Col md={6} className="d-flex flex-column justify-content-between" style={{ padding: '5rem' }}>
                            <div>
                                <Image alt='logo' className="mb-4" style={{ height: '50px', objectFit: 'contain', float: 'left' }} src={logo.logoLink} />
                            </div>
                            <h1>Log in.</h1>
                            <Form onSubmit={loginHandler} className="mt-2">
                                <Form.Group controlId="formBasicEmail" className="mb-4">
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FontAwesomeIcon icon={faUser} />
                                        </InputGroup.Text>
                                        <Form.Control type="email" placeholder="Email" style={{ padding: '.75rem' }} onChange={usernameChangedHandler} value={enteredUsername} />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mb-2">
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FontAwesomeIcon icon={faLock} />
                                        </InputGroup.Text>
                                        <Form.Control type="password" placeholder="Password" style={{ padding: '.75rem' }} onChange={passwordChangedHandler} value={enteredPass} />
                                    </InputGroup>
                                </Form.Group>
                                <p style={{ color: 'red' }}>{errorMsg}</p>

                                <Button variant="light" style={{ width: '100%', padding: '.75rem', fontSize: '1.1rem', backgroundColor: themeData.primary, color: 'white' }} type="submit" className="mb-4 mt-2">
                                    Log In
                                </Button>
                            </Form>
                            <p>Don't have an account yet? <a href="/signup">Sign Up</a></p>
                            <a href="/forgot">Forgot Password?</a>
                        </Col>
                        <Col style={{ backgroundColor: themeData.primary }} md={6} className="d-none d-md-block"></Col>
                    </Row>
                </Container>
            }
        </>
    );
};

export default Login;
