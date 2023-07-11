import React, { useEffect, useState } from "react";
import { Badge, Col, Container, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../redux/reducers/themeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitterSquare, faFacebookSquare, faInstagramSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {

    const dispatch = useDispatch();

    // apply theme
    const themes = useSelector(state => state.theme);
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    useEffect(() => {
        dispatch(fetchTheme())
        setThemeData(themes.theme[0])
    }, [])

    const r = parseInt(themeData.primary.substring(1, 3), 16);
    const g = parseInt(themeData.primary.substring(3, 5), 16);
    const b = parseInt(themeData.primary.substring(5, 7), 16);

    return (
        <>
            {themeData && themeData.logoLink &&
                <Container fluid className="text-center p-0" >
                    <Container fluid className="m-0 p-3" style={{ backgroundColor: themeData.primary, color: themeData.secondary }}>
                        <div>
                            <Image alt='logo' className="mb-2" style={{ height: '50px' }} src={themeData.logoLink} />
                            <div style={{ fontSize: '1.5rem' }} className="d-flex justify-content-center">
                                <a href="#" className="m-1"><FontAwesomeIcon icon={faTwitterSquare} inverse /></a>
                                <a href="#" className="m-1"><FontAwesomeIcon icon={faFacebookSquare} inverse /></a>
                                <a href="#" className="m-1"><FontAwesomeIcon icon={faInstagramSquare} inverse /></a>

                            </div>
                            <Container fluid className="m-0 p-0" style={{ color: 'gray' }}>
                                Copyright © 2023
                            </Container>
                        </div>
                    </Container>
                </Container>
            }
        </>
    );
};

export default Footer;





