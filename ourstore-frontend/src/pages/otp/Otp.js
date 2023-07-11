import axios from "axios"
import React, { useEffect, useState } from "react"
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from '../../App';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { fetchTheme } from "../../redux/reducers/themeSlice";
import { useNavigate } from "react-router";

const Otp = () => {

    const dispatch = useDispatch();
    const jwt = Cookies.get('jwt');
    const navigate = useNavigate();

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const [errorTextMsg, setErrorTextMsg] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [enteredOTP, setEnteredOTP] = useState("");
    const [formTextMsg, setFormTextMsg] = useState("");

    const otpChangedHandler = (event) => {
        setEnteredOTP(event.target.value);
    }

    const otpSubmitHandler = (event) => {
        event.preventDefault();
        axios.patch(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/otp`, {
            otp: enteredOTP
        }, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then(() => {
                navigate("/products");
            })
            .catch((err) => {
                setFormTextMsg("Your OTP is not valid!");
                setEnteredOTP("");
            })
    }

    useEffect(() => {
        //check if current user logged in
        axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/me`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                // check if current user has been verified
                console.log(res.data.verified)
                if (res.data.verified) {
                    setErrorTextMsg("You have been verified");
                    setIsFormVisible(false);
                }
            })
            .catch((err) => {
                console.log(isFormVisible)
                setErrorTextMsg("You are not logged in");
                setIsFormVisible(false);
            })
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
            {isFormVisible &&
                <Container fluid>
                    <Row style={{ height: '100vh' }}>
                        <Col md={6} className="d-flex flex-column justify-content-between mt-5 mb-5" style={{ padding: '5rem' }}>
                            <h1>Email Verification</h1>
                            <p style={{ color: 'gray' }}>We've emailed you a random code. Please check your email and enter the code here to complete the verification.</p>
                            <Form onSubmit={otpSubmitHandler} className={isFormVisible ? '' : 'd-none'}>
                                <Form.Group controlId="formBasicEmail" className="mb-4">
                                    <Form.Control type="text" placeholder="OTP" style={{ padding: '.75rem' }} onChange={otpChangedHandler} value={enteredOTP} />
                                </Form.Group>
                                <p style={{ color: 'red' }}>{formTextMsg}</p>
                                <Button variant="light" style={{ width: '100%', padding: '.75rem', fontSize: '1.1rem', backgroundColor: themeData.primary, color: 'white' }} type="submit" className="mb-4 mt-2">Verify</Button>
                            </Form>
                        </Col>
                        <Col style={{ backgroundColor: themeData.primary }} md={6} className="d-none d-md-block"></Col>
                    </Row>
                </Container>
            }
            {errorTextMsg && <h4>{errorTextMsg}</h4>}
        </>
    )
}

export default Otp;