import React, { useEffect, useState } from 'react';
import { Button, Col, Nav, Row, Tabs, Tab, Form, FormControl, Alert, Container, Card, Modal } from 'react-bootstrap';
import CustomModal from './modal/CustomModal';
import { typeOptions } from '../constant/landingPage';
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from '../App';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSinglePage, updateSinglePage } from '../redux/reducers/singlePageSlice';


const EditColumnTabs = ({ sectionData, themeData, tabs, setTabs, getFormByType, handleOnInputChange, TabContent, columns, pageid }) => {

    const jwt = Cookies.get('jwt');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [selectOption, setSelectOption] = useState(typeOptions);

    const handleCloseModal = () => setShowAlert(false);
    const handleShowModal = () => setShowAlert(true);

    const arraySections = useSelector(state => state.singlePage).pages.sections;

    // const handleOnFormTabChange = (event, index) => {
    //     setTabs(prev => {
    //         let tempItem = [...prev];
    //         console.log(tempItem)
    //         tempItem[index].landingPageForm[event.target.name] = event.target.value
    //         if (event.target.name === 'form_type') {
    //             tempItem[index].landingPageForm["form_input"] = getFormByType(event.target.value, index, tempItem[index].landingPageForm.data, handleOnInputChange).form
    //         }
    //         return tempItem
    //     })
    // }

    const handleOnFormTabChange = (event, index) => {
        console.log(sectionData)
        setTabs(prev => {
            let tempItem = [...prev];
            tempItem[index].landingPageForm[event.target.name] = event.target.value
            if (!sectionData[index]) {
                if (event.target.name === 'form_type') {
                    tempItem[index].landingPageForm["form_input"] = getFormByType(event.target.value, index, {}, handleOnInputChange).form
                    tempItem[index].landingPageForm.data = {}
                }
            } else {
                if (event.target.name === 'form_type' && sectionData[index].columnType === event.target.value) {
                    tempItem[index].landingPageForm["form_input"] = getFormByType(event.target.value, index, sectionData[index], handleOnInputChange).form
                    tempItem[index].landingPageForm.data = sectionData[index];
                } else {
                    tempItem[index].landingPageForm["form_input"] = getFormByType(event.target.value, index, {}, handleOnInputChange).form
                    tempItem[index].landingPageForm.data = {}
                }
            }
            return tempItem
        })
    }

    const addNewTab = () => {
        setTabs([...tabs, {
            content: TabContent,
            landingPageForm: {
                form_type: 'none',
                form_input: getFormByType('none', 0, {}, handleOnInputChange).form,
                data: {},
            }
        }]);
        setActiveTab(tabs.length);
    }

    const handleDeleteTab = (index) => {
        if (tabs.length === 1) {
            handleShowModal()
        }
        else {
            let newTabs = tabs;
            newTabs.splice(index, 1);
            setTabs(newTabs);
            setActiveTab(index > 0 ? index - 1 : index)
        }
    }


    const handleSelect = index => {
        setActiveTab(index)
    }

    useEffect(() => {
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
                            // setErrMsg('You are not authorized');
                            return;
                        }
                        // setIsBodyVisible(true);
                    })

            })
            .catch((err) => {
                navigate(`/login?goto=landingpage`);
            });

    }, [jwt, navigate]);

    useEffect(() => {
        const findPictOverlay = tabs.find(item => item.landingPageForm.form_type === "picOverlay")
        if (!!findPictOverlay) {
            setSelectOption(prev => {
                return prev.map(item => {
                    if (item.key === findPictOverlay.landingPageForm.form_type) {
                        item.disabled = true;
                    }
                    return item;
                })
            })
        }
    }, [tabs]);

    useEffect(() => {
        dispatch(fetchSinglePage(pageid))
    }, [])

    return (
        <Container>
            <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
                <Nav variant="tabs" style={{ border: 'none' }}>
                    {tabs.map((tab, index) => (
                        <Nav.Item key={index}>
                            <Nav.Link eventKey={index}>Column {index + 1}</Nav.Link>
                        </Nav.Item>
                    ))}
                    {tabs.length < 4 && (<Nav.Item>
                        <Nav.Link onClick={addNewTab}>+</Nav.Link>
                    </Nav.Item>)}
                </Nav>
                <Container>
                    <Row>
                        <Col xs={12} lg={8}>
                            <Tab.Content className='m-3 mt-4'>
                                {tabs.map((tab, index) => (
                                    <Tab.Pane key={index} eventKey={index}>
                                        <tab.content index={index} landingPageForm={tab.landingPageForm} handleOnFormTabChange={handleOnFormTabChange} selectOption={selectOption} />
                                        <Button variant="light" style={{ backgroundColor: themeData.secondary, color: 'white' }} onClick={() => { handleDeleteTab(index) }}>Delete</Button>
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Container>
            </Tab.Container>

            <CustomModal
                show={showAlert}
                handleClose={handleCloseModal}
                message="You cannot delete more tabs" />

        </Container>
    );
}

export default EditColumnTabs;