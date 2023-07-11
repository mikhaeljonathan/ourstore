import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessBuy = () => {

    const navigate = useNavigate();

    const [countdownTime, setCountdownTime] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdownTime((prevCountdownTime) => prevCountdownTime - 1);
        }, 1000);
        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        if (countdownTime === 0) {
            navigate('/products');
        }
    }, [countdownTime]);

    return (
        <h3>The purchase has been succeeded. Redirecting to products page in {countdownTime}</h3>
    )
}

export default SuccessBuy;