import axios from "axios";
import { useState } from "react";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from '../../App';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

import classes from './OtpForm.module.css';

const OtpForm = (props) => {

    const jwt = Cookies.get('jwt');
    const navigate = useNavigate();

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
                setFormTextMsg("Your OTP is not match!");
                setEnteredOTP("");
            })
    }

    return (
        <form onSubmit={otpSubmitHandler} className={(props.visible ? '' : classes.hidden)}>
            <label htmlFor="otp">OTP</label>
            <input id="otp" type="text" onChange={otpChangedHandler} value={enteredOTP} />
            <button type="submit">verify</button>
            <h3>{formTextMsg}</h3>
        </form>
    )

}

export default OtpForm;