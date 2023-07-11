import { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import AddSection from "../../components/AddSection";
import { useLocation } from 'react-router-dom';
import Header from "../../components/Header";
import PictureOverlay from "../../components/pagesComponent/PictureOverlay";
import TextSection from "../../components/pagesComponent/TextSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPages } from "../../redux/reducers/pagesSlice";
import { fetchTheme } from "../../redux/reducers/themeSlice";
import axios from "axios";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";
import Cookies from "js-cookie";
import '../../components/CustomPage.css'
import EditSection from "../../components/EditSection";
import ImageColumn from "../../components/pagesComponent/ImageColumn";
import ProductCardPage from "../../components/pagesComponent/ProductCardPage";
import Footer from "../../components/Footer";

import './LandingPage.css'
import { toast, ToastContainer } from "react-toastify";

const LandingPage = () => {

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
    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });
    const pageObj = pages.find((obj) => obj.name.replace(/\s/g, '').toLowerCase() === pathname.toLowerCase().slice(1));

    useEffect(() => {
        if (successMsg.isShown) {
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])

    const triggerIsDeletedAlert = () => {
        setSuccessMsg({ isShown: true, msg: 'Section deleted successfully' });
    }

    useEffect(() => {
        dispatch(fetchAllPages())
        // check if user is logged in or not
        console.log(BE_HOSTNAME, BE_PORT);
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

    if (pages.length === 0 || themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    const r = parseInt(themeData.primary.substring(1, 3), 16);
    const g = parseInt(themeData.primary.substring(3, 5), 16);
    const b = parseInt(themeData.primary.substring(5, 7), 16);


    const handleEditSection = (sectionId) => {
        let editedSectionPage = pages.filter(page => page.name.replace(/\s/g, '').toLowerCase() === pathname.toLowerCase().slice(1))
        let columnsBySectionId = editedSectionPage[0].sections.find(section => {
            return section._id === sectionId;
        });
        setColumnToBeEdited(columnsBySectionId)
        setEditSectionModalShow(true)
    }

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


    return (
        <div className='wrapper'>
            <Header />
            <Container fluid className="p-0 content">
                {pageObj && pageObj.sections.length !== 0 ? (pageObj.sections.map((section, i) => {
                    return (
                        <div key={i} style={{ '--hover-section-hover': `rgba(${r}, ${g}, ${b}, 0.1)` }} className={`p-0 ${isAdmin ? "hover-section" : ""}`} role={isAdmin ? "button" : ''} onClick={isAdmin ? () => handleEditSection(section._id) : undefined}>
                            <Row xs={1} md={section.columns.length} key={i} >
                                {section.columns.map((column, idx) => {
                                    return getSectionType(column, idx);
                                })}
                            </Row>
                        </div>
                    );
                })
                ) : (
                    <div className="text-center mt-3">
                        <h5>No sections added yet</h5>
                    </div>
                )}

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
                {<AddSection themeData={themeData} show={addSectionModalShow} onHide={() => setAddSectionModalShow(false)} pageObj={pageObj} />}
                {editSectionModalShow && <EditSection show={editSectionModalShow} onHide={() => setEditSectionModalShow(false)} pageObj={pageObj} sectionTabs={columnToBeEdited} triggerIsDeletedAlert={triggerIsDeletedAlert} />}
            </Container>
            <Footer className='footer' />

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
        </div>
    )
}

export default LandingPage; 