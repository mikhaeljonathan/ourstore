import { useEffect, useState } from "react";
import { Button, Modal, Form, Card, Container, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateSinglePage } from "../redux/reducers/singlePageSlice";
import ColumnTabs from "./ColumnTabs";
import InputTextArea from './input/InputTextArea';
import UploadPicture from './input/UploadPicture';
import InputProduct from './input/InputProduct';
import InputText from './input/InputText';
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
                imageLink: ""
            }
            break;
        case 'text':
            item.form = <>
                <InputText label={'Header'} name="header" value={data?.header || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
                <InputTextArea label={'Content'} name="content" value={data?.content || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
            </>
            item.data = {
                header: "",
                content: ""
            }
            break;
        case 'pictureoverlay':
            item.form = <>
                <UploadPicture name="imageLink" value={data?.imageLink || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
                <InputTextArea label={'Content'} name="content" value={data?.content || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
            </>
            item.data = {
                imageLink: "",
                content: ""
            }
            break;
        case 'product':
            item.form = <InputProduct name="productId" value={data?.productId || ''} handleOnChange={(e) => handleOnInputChange(e, index)} />
            item.data = {
                productId: ""
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
                                    <Form.Select name="form_type" onChange={(e) => handleOnFormTabChange(e, index)}>
                                        {selectOption.map((option) => (
                                            <option disabled={option.disabled} key={option.key} value={option.key}>{option.label}</option>
                                        ))}
                                    </Form.Select>
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

const AddSection = ({ themeData, pageObj, show, onHide }) => {

    const dispatch = useDispatch();

    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });

    useEffect(() => {
        if (successMsg.isShown) {
            console.log("a")
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])


    const handleOnInputChange = (event, index) => {
        console.log(event.target)
        setTabs(prev => {
            prev[index].landingPageForm.data[event.target.name] = event.target.value;
            return prev;
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

    const handleSubmit = async (e) => {
        const tempNewSection = tabs.map(item => {
            return {
                "columnType": item.landingPageForm.form_type,
                ...item.landingPageForm.data
            }
        })

        const body = {
            sections: [...pageObj.sections, { columns: tempNewSection }]
        }

        let res = await dispatch(updateSinglePage(pageObj._id, body))
        if (res === 'success') {
            setTimeout(() => {
                // resetStateValues()
            }, 1000);
            setTimeout(() => {
                setSuccessMsg({ isShown: true, msg: 'New section added successfully' });
                onHide();
            }, 1000);
        }
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
                <Modal.Header style={{ backgroundColor: '#f5f5f5' }} closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add New Section
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ColumnTabs themeData={themeData} tabs={tabs} setTabs={setTabs} getFormByType={getFormByType} handleOnInputChange={handleOnInputChange} TabContent={TabContent} />
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#f5f5f5' }}>
                    <Button onClick={onHide} variant="secondary">Discard</Button>
                    <Button variant="light" style={{ '--bs-btn-border-color': themeData.secondary, backgroundColor: themeData.secondary, color: 'white' }} type="submit" onClick={handleSubmit}>Add</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}

export default AddSection;
