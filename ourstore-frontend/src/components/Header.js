import React, { useEffect, useState } from "react";
import { Container, Image, Nav, Navbar, NavDropdown, NavLink } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPages } from "../redux/reducers/pagesSlice";
import { fetchTheme } from "../redux/reducers/themeSlice";
import Cookies from "js-cookie";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../App";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from '../components/modal/ConfirmationDialog';

export default function Header(props) {
    const dispatch = useDispatch();
    const jwt = Cookies.get('jwt');
    const navigate = useNavigate();

    const pages = useSelector(state => state.pages).pages

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "primary": "#000000", "secondary": "#000000" });

    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const handleCloseConfirmationDialog = () => setShowConfirmationDialog(false);
    const handleShowConfirmationDialog = () => setShowConfirmationDialog(true);

    const handleLogout = () => {
        Cookies.remove("jwt");
        navigate("/login");
    }

    useEffect(() => {
        dispatch(fetchAllPages())
        dispatch(fetchTheme())
        setThemeData(themes.theme[0])

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
                        setUsername(res.data.username);
                        if (res.data.role === 'admin') {
                            setIsAdmin(true);
                        }
                    })
            })
            .catch((err) => {
                setUsername(null)
                setIsAdmin(false)
            });

    }, [jwt, navigate])

    const defineRedirectUrl = (pageName, pageId, idx) => {
        let pageUrl = '';
        pageName.toLowerCase() === 'landing page' ? pageUrl = 'landingpage' : pageName.toLowerCase() === 'products' ? pageUrl = 'products' : pageUrl = `pages/${pageId}`

        return (
            <NavLink as={Link} to={`/${pageUrl}`} eventKey={idx} key={idx} >
                {pageName}
            </NavLink>
        )
    }

    var obj = [...pages];
    var finalNavs = obj.filter(obj => obj.isInHeader === true)

    return (
        <Container fluid className="p-0 m-0">
            <Navbar variant="dark" expand="md" style={{ backgroundColor: themeData.primary, paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <Navbar.Brand href="#home">
                    <Image alt='logo' className="mb-2" style={{ height: '50px' }} src={themeData.logoLink} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                    <Nav className="mr-auto pl-2">
                        <NavLink as={Link} to={`/products`}>
                            Products
                        </NavLink>
                        {/* <NavLink as={Link} to={`/landingpage`}>
                            Landing Pa
                        </NavLink> */}
                        {finalNavs && finalNavs.map((navItem, i) => {
                            const redirectLink = defineRedirectUrl(navItem.name, navItem._id, i);
                            return redirectLink;

                        })}
                    </Nav>
                    <Nav className="mr-auto pr-2">
                        {username ? <NavDropdown title={`Hi, ${username}`} id="basic-nav-dropdown" align="end">
                            {isAdmin === true &&
                                <>
                                    <NavDropdown.Item href="/theme">Customize Theme</NavDropdown.Item>
                                    <NavDropdown.Item href="/managepage">Manage Pages</NavDropdown.Item>
                                    <NavDropdown.Item href="/dashboard">Dashboard</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                </>
                            }
                            <NavDropdown.Item href="/editprofile">Edit Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleShowConfirmationDialog}>Logout</NavDropdown.Item>

                        </NavDropdown> : <Nav.Link href="/login">Login</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <ConfirmationDialog
                show={showConfirmationDialog}
                handleClose={handleCloseConfirmationDialog}
                handleConfirm={handleLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                confirmLabel="Yes"
                unconfirmLabel="No"
                confirmVariant="primary"
            />
        </Container>

    );
}