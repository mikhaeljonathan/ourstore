import { useEffect, useState } from "react";
import { Button, Modal, Form, Card, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { typeOptions } from "../constant/landingPage";
import { updateSinglePage } from "../redux/reducers/singlePageSlice";
import EditColumnTabs from "./EditColumnTabs";
import InputProduct from "./input/InputProduct";
import InputText from "./input/InputText";
import InputTextArea from "./input/InputTextArea";
import UploadPicture from "./input/UploadPicture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import ConfirmationDialog from '../components/modal/ConfirmationDialog';
import { fetchTheme } from "../redux/reducers/themeSlice";
import { toast, ToastContainer } from "react-toastify";

const cardStyle = {
    backgroundColor: '#f5f5f5',
    color: '#000',
    borderRadius: '0',
};

const getFormByType = (type, index, data, handleOnInputChange) => {
    let item = {};
    switch (type) {
        case 'none':
            item.form = null;
            item.data = {};
            break;
        case 'picture':
            item.form = <UploadPicture name="imageLink" value={data?.imageLink || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
            item.data = {
                imageLink: data.imageLink
            }
            break;
        case 'text':
            item.form = <>
                <InputText label={'Header'} name="header" value={data.header || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
                <InputTextArea label={'Content'} name="content" value={data.content || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
            </>
            item.data = {
                header: data.header,
                content: data.content
            }
            break;
        case 'pictureoverlay':
            item.form = <>
                <UploadPicture name="imageLink" value={data?.imageLink || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
                <InputTextArea label={'Content'} name="content" value={data?.content || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
            </>
            item.data = {
                imageLink: data.imageLink,
                content: data.content
            }
            break;
        case 'product':
            item.form = <InputProduct name="productId" value={data?.productId || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
            item.data = {
                productId: data.productId
            }
            break;
        default:
            item.form = null;
            item.data = {};
            break;
    }
    return item;
}

function TabContent({ index, landingPageForm, handleOnFormTabChange, selectOption }) {

    const selectedOption = typeOptions.find(option => option.key === landingPageForm.form_type);

    return (
        <div>
            <Card style={cardStyle} className='mb-3'>
                <Form className='m-3'>
                    <Form.Group controlId="formSelectTypeOptions">
                        <Container fluid>
                            <Row style={{ alignItems: 'center' }}>
                                <Col sm={4}>
                                    <Form.Label>Form Type</Form.Label>
                                </Col>
                                <Col sm={8}>
                                    {selectedOption && <Form.Select name="form_type" onChange={(e) => handleOnFormTabChange(e, index)} value={selectedOption.key}>
                                        {selectOption.map((option) => {
                                            return (
                                                <option disabled={option.disabled} key={option.key} value={option.key} >{option.label}</option>
                                            )
                                        })}
                                    </Form.Select>}
                                </Col>
                            </Row>
                        </Container>
                    </Form.Group>
                    {landingPageForm.form_input ? landingPageForm.form_input : null}
                </Form>
            </Card>
        </div>
    );
}

const EditSection = ({ pageObj, show, onHide, sectionTabs, triggerIsDeletedAlert, triggerIsEditedAlert }) => {

    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });

    const [sectionData, setSectionData] = useState([]);
    const dispatch = useDispatch();
    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const handleCloseConfirmationDialog = () => setShowConfirmationDialog(false);
    const handleShowConfirmationDialog = () => setShowConfirmationDialog(true);

    const handleOnInputChange = (event, index) => {
        setTabs(previousTabs => {
            const newData = {
                ...previousTabs[index].landingPageForm.data,
                // [event.target.name]: event.target.value,
            };
            newData[event.target.name] = event.target.value
            const newTabs = [...previousTabs];
            newTabs[index].landingPageForm.data = newData;
            return newTabs;
        });
    }

    const [tabs, setTabs] = useState([
        {
            content: TabContent,
            landingPageForm: {
                form_type: 'none',
                form_input: getFormByType('none', 0, '', handleOnInputChange).form,
                data: getFormByType('none', 0, '', handleOnInputChange).data,
            },
        },
    ]);

    useEffect(() => {
        if (sectionTabs) {
            let tempTabs = sectionTabs.columns.map((tab, index) => {
                return {
                    content: TabContent,
                    landingPageForm: {
                        form_type: tab.columnType,
                        form_input: getFormByType(tab.columnType, index, tab, handleOnInputChange).form,
                        data: tab,
                    }
                };
            })
            setSectionData(sectionTabs.columns)
            setTabs(tempTabs)
        }

        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [sectionTabs])

    useEffect(() => {
        console.log(successMsg.isShown)
        if (successMsg.isShown) {
            console.log("a")
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])

    const handleSubmit = async (e) => {
        const sectionIndex = pageObj.sections.findIndex(section => section._id === sectionTabs._id);

        const tempNewSection = tabs.map(item => {
            return {
                ...item.landingPageForm.data,
                "columnType": item.landingPageForm.form_type
            }
        })

        if (sectionIndex !== -1) {
            const updatedSections = [...pageObj.sections];
            updatedSections[sectionIndex] = {
                ...updatedSections[sectionIndex],
                columns: tempNewSection,
            };
            const body = {
                sections: updatedSections,
            };

            let res = await dispatch(updateSinglePage(pageObj._id, body))
            if (res === 'success') {
                triggerIsEditedAlert()
                setTimeout(() => {
                    onHide();
                }, 4000)
            }
        }
    }

    const handleDeleteSection = async () => {
        let updatedSection = pageObj.sections.filter((item) => item._id !== sectionTabs._id);
        let raw = {
            "sections": updatedSection
        };
        let res = await dispatch(updateSinglePage(pageObj._id, raw))
        if (res === 'success') {
            setShowConfirmationDialog(false);
            triggerIsDeletedAlert();
            setTimeout(() => {
                onHide();
            }, 4000)
        }
    }

    if (themes.theme.length === 0) {
        return <div>Please Wait...</div>;
    }

    return (
        <div>
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
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                style={{ fontFamily: 'Nunito' }}
            >
                <Modal.Header closeButton style={{ backgroundColor: '#f2f2f2', border: 'none' }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Section
                    </Modal.Title>
                    <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '1rem', color: 'red' }} role="button" onClick={handleShowConfirmationDialog} />
                </Modal.Header>
                <Modal.Body>
                    {pageObj && <EditColumnTabs sectionData={sectionData} themeData={themeData} tabs={tabs} setTabs={setTabs} getFormByType={getFormByType} handleOnInputChange={handleOnInputChange} TabContent={TabContent} columns={sectionTabs} pageid={pageObj._id} />}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#f2f2f2' }}>
                    <Button onClick={onHide} variant="secondary">Discard</Button>
                    <Button variant="light" style={{ backgroundColor: themeData.secondary, color: 'white' }} type="submit" onClick={handleSubmit}>Save</Button>
                </Modal.Footer>
            </Modal>

            <ConfirmationDialog
                show={showConfirmationDialog}
                handleClose={handleCloseConfirmationDialog}
                handleConfirm={handleDeleteSection}
                title="Confirm Delete Section"
                message="Are you sure you want to delete this section?"
                confirmLabel="Confirm"
                unconfirmLabel="Cancel"
                confirmVariant="primary"
            />
        </div>
    )

}

export default EditSection;
