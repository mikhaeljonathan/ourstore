import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../App";
import { fetchTheme } from "../redux/reducers/themeSlice";
import Header from "./Header";
import Footer from "./Footer";

import '../pages/landingPage/LandingPage.css'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = (props) => {

    const jwt = Cookies.get('jwt');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [enteredUsername, setEnteredUsername] = useState(null);
    const [enteredNewPass, setEnteredNewPass] = useState(null);
    const [enteredConfirmPass, setEnteredConfirmPass] = useState(null);
    const [enteredCrnPass, setEnteredCrnPass] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });

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
                        setEnteredUsername(res.data.username)
                    })
            })
            .catch((err) => {
                setUser(null);
                navigate('/login');
            });

        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [dispatch, jwt, navigate, successMsg])

    const handleLogout = () => {
        Cookies.remove("jwt");
        navigate("/login");
    }


    const handleSwitchChange = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    const usernameChangedHandler = (event) => {
        setEnteredUsername(event.target.value);
    }

    const crnPassChangedHandler = (event) => {
        setEnteredCrnPass(event.target.value);
    }

    const newPassChangedHandler = (event) => {
        setEnteredNewPass(event.target.value);
    }

    const confirmPassChangedHandler = (event) => {
        setEnteredConfirmPass(event.target.value);
    }

    const editProfileHandler = (event) => {
        event.preventDefault();

        if (enteredUsername.length === 0 || (showPasswordForm && (enteredCrnPass.length === 0 || enteredConfirmPass.length === 0 || enteredNewPass.length === 0))) {
            setErrorMsg('Field must not be blank');
            return;
        }

        if (showPasswordForm && enteredNewPass !== enteredConfirmPass) {
            setErrorMsg('Password and confirm password are not the same');
            return;
        };

        if (showPasswordForm) {
            axios.patch(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/pass`, {
                password: enteredCrnPass,
                newpassword: enteredNewPass
            }, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }).then((res) => {
                // setSuccessMsg({ isShown: true, msg: 'Profile updated successfully' });
                axios.patch(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/${user._id}`, {
                    username: enteredUsername,
                }, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }).then((res) => {
                    setSuccessMsg({ isShown: true, msg: 'Profile updated successfully' });
                    // Cookies.remove("jwt");
                    // navigate("/login");
                }).catch((err) => {
                    console.log(err)
                    // setErrorMsg(err.response.data.message);
                });
            }).catch((err) => {
                console.log(err.response.data.message)
                setErrorMsg(err.response.data.message);
            });
        }

        else {
            axios.patch(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users`, {
                username: enteredUsername,
            }, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }).then(() => {
                setSuccessMsg({ isShown: true, msg: 'Profile updated successfully' });
                // window.location.reload();
            }).catch((err) => {
                setErrorMsg(err.response.data.message);
            });
        }
    }

    useEffect(() => {
        if (successMsg.isShown) {
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])

    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    const r = parseInt(themeData.primary.substring(1, 3), 16);
    const g = parseInt(themeData.primary.substring(3, 5), 16);
    const b = parseInt(themeData.primary.substring(5, 7), 16);

    return (
        <>
            {user &&
                <>
                    <ToastContainer
                        position='top-center'
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme='colored'
                    />

                    <div className='wrapper'>
                        <Header />
                        <Container fluid className="p-0 m-0 content">
                            <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.45)`, height: '15vh' }}>
                                <h4>Your Profile</h4>
                            </div>
                            <div className="d-flex justify-content-center align-items-center mt-4 m-auto">
                                <div style={{ width: "40vw" }}>

                                    <Form.Group className="mt-3 mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            id="email"
                                            type="text"
                                            value={user.email}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form encType="multipart/form-data">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                id="username"
                                                type="text"
                                                value={enteredUsername}
                                                onChange={usernameChangedHandler}
                                            />
                                        </Form.Group>
                                    </Form>

                                    <Form>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Change Password"
                                            onChange={handleSwitchChange}
                                            className="mb-3"
                                        />

                                        {showPasswordForm && (
                                            <>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Current Password</Form.Label>
                                                    <Form.Control
                                                        id="crnPassk"
                                                        type="password"
                                                        value={enteredCrnPass}
                                                        onChange={crnPassChangedHandler} />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>New Password</Form.Label>
                                                    <Form.Control
                                                        id="newPass"
                                                        type="password"
                                                        value={enteredNewPass}
                                                        onChange={newPassChangedHandler} />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Confirm New Password</Form.Label>
                                                    <Form.Control
                                                        id="confirmPass"
                                                        type="password"
                                                        value={enteredConfirmPass}
                                                        onChange={confirmPassChangedHandler} />
                                                </Form.Group>
                                            </>
                                        )}

                                    </Form>
                                    <p style={{ color: 'red' }}>{errorMsg}</p>
                                    <div className="d-flex justify-content-center mt-5 mb-5">
                                        <Button variant="light" style={{ backgroundColor: themeData.primary, color: 'white' }} onClick={editProfileHandler}>Submit</Button>
                                    </div>
                                </div>
                            </div>
                        </Container>
                        <Footer />
                    </div >
                </>
            }
        </>
    );
};

export default EditProfile;





