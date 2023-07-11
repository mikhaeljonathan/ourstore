import { useState } from "react";

import classes from './FormReset.module.css';

const FormReset = (props) => {
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    
    const passwordChangedHandler = (event) => {
        setEnteredPassword(event.target.value);
    }

    const confirmPasswordChangedHandler = (event) => {
        setEnteredConfirmPassword(event.target.value);
    }

    const resetHandler = (e) => {
        e.preventDefault();
        props.onFormSubmit(enteredPassword, enteredConfirmPassword);
    }

    return (
        <form onSubmit={resetHandler} className={(props.visible) ? '' : classes.hidden}>
            <label htmlFor="password">New Password</label>
            <input id="password" type="password" onChange={passwordChangedHandler} value={enteredPassword} />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" onChange={confirmPasswordChangedHandler} value={enteredConfirmPassword} />
            <button type="submit">Reset</button>
        </form>
    )
}

export default FormReset