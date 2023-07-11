import { useEffect, useState } from "react";
import axios from "axios";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from '../../App';
import { useNavigate, useParams } from "react-router-dom";
import FormReset from "./FormReset";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { fetchTheme } from "../../redux/reducers/themeSlice";
import { useDispatch, useSelector } from "react-redux";

const Reset = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [titleMsg, setTitleMsg] = useState('Enter your new password');
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [errMsg, setErrMsg] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');

    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const passwordChangedHandler = (event) => {
        setEnteredPassword(event.target.value);
    }

    const confirmPasswordChangedHandler = (event) => {
        setEnteredConfirmPassword(event.target.value);
    }

    useEffect(() => {
        axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/pass/reset/token/check/${token}`)
            .catch(err => {
                setTitleMsg(err.response.data.message);
                setIsFormVisible(false);
            });

        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [token]);

    const resetNow = (e) => {
        e.preventDefault()
        if (enteredPassword.length === 0 || enteredConfirmPassword.length === 0) {
            setErrMsg('Please fill the required field');
            return;
        }
        if (enteredPassword !== enteredConfirmPassword) {
            setErrMsg('Password and confirm password are not the same');
            return;
        }
        axios.patch(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/pass/reset/${token}`, {
            password: enteredPassword
        }, {
            withCredentials: true
        })
            .then(() => {
                navigate('/login');
            })
            .catch((err) => {
                setErrMsg(err.response.data.message);
            })

    }

    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    return (
        <>
            {
                isFormVisible && <Container fluid>
                    <Row style={{ height: '100vh', backgroundColor: themeData.primary }} className="d-flex justify-content-center align-items-center justify-content between">
                        <Card className="p-5 text-center" style={{ backgroundColor: 'white', width: '40%' }}>
                            <h2 className="mb-4">Reset Password</h2>
                            <h6 style={{ color: 'gray' }} className="mb-4">Please enter your new password</h6>
                            {/* <FormReset onFormSubmit={resetNow} visible={isFormVisible} /> */}
                            <Form onSubmit={resetNow} className="mt-2">
                                <Form.Group controlId="formBasicEmail" className="mb-4">
                                    <Form.Control type="password" placeholder="New Password" style={{ padding: '.75rem' }} onChange={passwordChangedHandler} value={enteredPassword} />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail" className="mb-4">
                                    <Form.Control type="password" placeholder="Confirm New Password" style={{ padding: '.75rem' }} onChange={confirmPasswordChangedHandler} value={enteredConfirmPassword} />
                                </Form.Group>
                                <p style={{ color: 'red' }}>{errMsg}</p>
                                <Button variant="primary" type="submit" className="mb-4 mt-2" style={{ width: '100%', padding: '.75rem', fontSize: '1.1rem', backgroundColor: themeData.primary, color: 'white' }}>
                                    Reset
                                </Button>
                            </Form>
                        </Card>
                    </Row>
                </Container>
            }
            {!isFormVisible && <h3>{titleMsg}</h3>}
        </>
    )
}

export default Reset;