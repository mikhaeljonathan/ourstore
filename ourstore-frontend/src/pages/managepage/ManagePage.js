import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import ManagePageBody from "./ManagePageBody";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Container } from "react-bootstrap";
import { fetchTheme } from "../../redux/reducers/themeSlice";

const ManagePage = () => {

    const jwt = Cookies.get('jwt');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState('');
    const [isBodyVisible, setIsBodyVisible] = useState(false);

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    useEffect(() => {
        // check if user is logged in or not
        axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/jwt/check`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                // check if user has an admin role
                axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/users/me`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
                    .then((res) => {
                        if (res.data.role !== 'admin') {
                            setErrMsg('You are not authorized');
                            return;
                        }
                        setIsBodyVisible(true);
                    })

            })
            .catch((err) => {
                navigate(`/login?goto=managepage`);
            });

        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [dispatch, jwt, navigate]);

    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    const r = parseInt(themeData.primary.substring(1, 3), 16);
    const g = parseInt(themeData.primary.substring(3, 5), 16);
    const b = parseInt(themeData.primary.substring(5, 7), 16);


    return (
        <div className="wrapper">
            <Header />
            {/* <h1>{errMsg}</h1> */}
            <Container fluid className="content p-0 m-0">
                <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: themeData.secondary, height: '15vh' }}>
                    <h4>Your Pages</h4>
                </div>
                <ManagePageBody themeData={themeData} visible={isBodyVisible} />

            </Container>
            <Footer className="footer" />
        </div>
    )

}

export default ManagePage;