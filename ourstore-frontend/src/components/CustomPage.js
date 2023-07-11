import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../App";
import { fetchAllPages } from "../redux/reducers/pagesSlice";
import { fetchTheme } from "../redux/reducers/themeSlice";
import AddSection from "./AddSection";
import Header from "./Header";
import ImageColumn from "./pagesComponent/ImageColumn";
import PictureOverlay from "./pagesComponent/PictureOverlay";
import ProductCardPage from "./pagesComponent/ProductCardPage";
import TextSection from "./pagesComponent/TextSection";
import './CustomPage.css';
import EditSection from "./EditSection";
import { updateSinglePage } from "../redux/reducers/singlePageSlice";
import Footer from "./Footer";

import '../pages/landingPage/LandingPage.css'
import { toast, ToastContainer } from "react-toastify";

const CustomPage = () => {

    const jwt = Cookies.get('jwt');
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const pages = useSelector(state => state.pages).pages;

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const [addSectionModalShow, setAddSectionModalShow] = useState(false);
    const [editSectionModalShow, setEditSectionModalShow] = useState(false);
    const [columnToBeEdited, setColumnToBeEdited] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [pageTitle, setPageTitle] = useState('');
    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });
    let isCurrentPageActive;
    let isCurrentPageExist;

    if (pages && pages.length > 0) {
        isCurrentPageExist = pages.some((nav) => nav._id === pathname.split("/")[2]);
        isCurrentPageActive = pages.some((nav) => nav._id === pathname.split("/")[2] && nav.isActive === true);
    }

    useEffect(() => {
        if (successMsg.isShown) {
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])

    const triggerIsDeletedAlert = () => {
        setSuccessMsg({ isShown: true, msg: 'Section deleted successfully' });
        setTimeout(() => {
            window.location.reload()
        }, 3000)
    }

    const triggerIsEditedAlert = () => {
        setSuccessMsg({ isShown: true, msg: 'Section updated successfully' });
        setTimeout(() => {
            window.location.reload()
        }, 3000)
    }
    useEffect(() => {
        dispatch(fetchAllPages())

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
                        if (res.data.role === 'admin') {
                            setIsAdmin(true);
                        }
                    })
            })
            .catch((err) => {
                setIsAdmin(false)
            });

        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [dispatch])

    const handleEditSection = (sectionId) => {
        let editedSectionPage = pages.filter(page => page._id === pathname.split("/")[2])
        // filter specific column/row index
        let columnsBySectionId = editedSectionPage[0].sections.find(section => {
            return section._id === sectionId;
        }); // contains sectionid and arrayofcolumns
        setColumnToBeEdited(columnsBySectionId)
        setEditSectionModalShow(true)
    }

    const handleUpdatePageTitle = async (pageId) => {
        console.log(pageTitle)
        if (pageTitle.length === 0) {
            setErrMsg('Page title must not be empty');
            return;
        }

        let body = {
            "name": pageTitle
        }

        let res = await dispatch(updateSinglePage(pageId, body))
        if (res === 'success') {
            setSuccessMsg({ isShown: true, msg: 'Page title updated successfully' });
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        }

        setErrMsg('');
    };

    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    const r = parseInt(themeData.primary.substring(1, 3), 16);
    const g = parseInt(themeData.primary.substring(3, 5), 16);
    const b = parseInt(themeData.primary.substring(5, 7), 16);

    let renderedPage;

    if ((isCurrentPageExist && isCurrentPageActive) || (isCurrentPageExist && !isCurrentPageActive && isAdmin)) {
        const pageObj = pages.find((obj) => obj._id === pathname.split("/")[2]);
        const getSectionType = (column, idx) => {
            let sectionColumnType = null
            switch (column.columnType) {
                case 'picture':
                    sectionColumnType = <ImageColumn column={column} key={idx} />
                    break;
                case 'text':
                    sectionColumnType = <TextSection column={column} key={idx} />
                    break;
                case 'pictureoverlay':
                    sectionColumnType = <PictureOverlay column={column} key={idx} />
                    break;
                case 'product':
                    sectionColumnType = <ProductCardPage column={column} key={idx} />
                    break;
                default:
                    sectionColumnType = null;
                    break;
            }
            return sectionColumnType
        }



        renderedPage =
            <div className='wrapper'>
                <Header />
                <Container fluid className="p-0 content">
                    {isAdmin ? (
                        <Container fluid>
                            <Row style={{ backgroundColor: themeData.secondary }} className="p-3">
                                <Col md={4}>
                                    <Form>
                                        <Form.Group controlId="exampleForm.ControlInput1">
                                            <Form.Control type="text" placeholder="Page Name" defaultValue={pageObj.name} onChange={(e) => setPageTitle(e.target.value)} />
                                        </Form.Group>
                                    </Form>
                                    {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
                                </Col>
                                <Col md={6}></Col>
                                <Col md={2} className="d-flex justify-content-end align-items-start">
                                    <Button variant="none" style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.8)`, color: 'white' }} onClick={() => handleUpdatePageTitle(pageObj._id)}>Save Changes</Button>
                                </Col>
                            </Row>
                        </Container>) : (<></>)
                    }
                    {
                        pageObj.sections.length !== 0 ?
                            (pageObj.sections.map((section, i) => {
                                return (
                                    <div key={i} style={{ '--hover-section-hover': `rgba(${r}, ${g}, ${b}, 0.1)` }} className={`p-0 ${isAdmin ? "hover-section" : ""}`} role={isAdmin ? "button" : undefined} onClick={isAdmin ? () => handleEditSection(section._id) : undefined}>
                                        <Row sm={1} md={section.columns.length} key={i} className="p-0">
                                            {section.columns.map((column, idx) => {
                                                return getSectionType(column, idx);
                                            })}
                                        </Row>
                                    </div>
                                );
                            }))
                            :
                            (
                                <div className="text-center mt-3">
                                    <h5>No sections added yet</h5>
                                </div>
                            )
                    }
                    {
                        isAdmin ?
                            <Button
                                variant="none"
                                style={{
                                    position: 'fixed',
                                    bottom: '20px',
                                    right: '20px',
                                    backgroundColor: `rgba(${r}, ${g}, ${b}, 1)`,
                                    color: 'white',
                                    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                                }}
                                onClick={() => setAddSectionModalShow(true)}>
                                Add Section
                            </Button>
                            : <></>
                    }

                    <AddSection themeData={themeData} show={addSectionModalShow} onHide={() => setAddSectionModalShow(false)} pageObj={pageObj} />
                    {editSectionModalShow && <EditSection show={editSectionModalShow} onHide={() => setEditSectionModalShow(false)} pageObj={pageObj} sectionTabs={columnToBeEdited} triggerIsDeletedAlert={triggerIsDeletedAlert} triggerIsEditedAlert={triggerIsEditedAlert} />}
                </Container>
                <Footer />
            </div>
    }
    else if (isCurrentPageExist && !isCurrentPageActive) {
        renderedPage =
            <div>
                {/* FOR CUSTOMER */}
                You aren't allowed to access this page!
            </div>
    }
    else {
        renderedPage =
            <div>
                Page Not Found
            </div>
    }

    return (
        <>
            <ToastContainer
                position='top-center'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
            {renderedPage}
        </>
    )
}

export default CustomPage; 