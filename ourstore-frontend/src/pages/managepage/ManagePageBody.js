import axios from "axios";
import React, { useEffect, useState } from "react";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";
import Cookies from 'js-cookie';
import PageItem from "./PageItem";

import classes from './ManagePageBody.module.css';
import AddPage from "./AddPage";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ManagePageBody = (props) => {

    const jwt = Cookies.get('jwt');
    const themeData=props.themeData;

    const [pages, setPages] = useState([]);
    const [successMsg, setSuccessMsg] = useState({
        isShown: false,
        msg: ''
    });
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        // Fetch pages in database
        axios.get(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/pages`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                setPages(res.data.data);
            })
    }, [successMsg])

    const onChangeHandler = (page) => {
        axios.patch(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/pages/${page._id}`, page, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                setSuccessMsg({ isShown: true, msg: 'Page updated successfully' });
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            })
            .catch((err) => {
                console.log(err);
                // setLoadingMsg(err.message)
            })

        // setMsg('Loading');
    }

    const deletePageHandler = (id) => {
        let updatedPage = pages.filter((item) => item._id !== id);
        setPages(updatedPage)
        axios.delete(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/pages/${id}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then((res) => {
                setSuccessMsg({ isShown: true, msg: 'Page deleted successfully' });
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            })
            .catch((err) => {
                console.log(err);
                // setLoadingMsg(err.message)
            })

        // setLoadingMsg('Loading');
    }

    const onAddedHandler = () => {
        setSuccessMsg({ isShown: true, msg: 'Page added successfully' });
        setTimeout(() => {
            window.location.reload()
        }, 3000)
    }

    const addPageHandler = () => {
        setShowAddModal(true)
    }

    useEffect(() => {
        if (successMsg.isShown) {
            toast.success(`${successMsg.msg}`);
            setSuccessMsg({ isShown: false, msg: '' })
        }
    }, [successMsg.isShown])

    return (
        <>
            {/* <PopUpMessage msg={loadingMsg} /> */}
            <ToastContainer
                position='top-center'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                theme='colored'
            />
            <div className={(props.visible) ? 'p-1' : classes.hidden}>
                {/* <Row className="d-flex align-items-center"> */}
                <div style={{ margin: '1rem', textAlign: 'right' }}>
                    <Button variant="light" style={{ backgroundColor: themeData.secondary, color: 'white' }} onClick={addPageHandler}>Add Page</Button>
                </div>
                {pages.map((el) => <PageItem themeData={themeData} key={el._id} pageData={el} changeHandler={onChangeHandler} deletePageHandler={deletePageHandler} />)}
            </div>
            {showAddModal && <AddPage themeData={themeData} show={showAddModal} onHide={() => setShowAddModal(false)} onAdded={onAddedHandler} />}
        </>
    )
}

export default ManagePageBody;