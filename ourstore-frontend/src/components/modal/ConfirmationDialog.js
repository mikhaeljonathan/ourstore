import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme } from '../../redux/reducers/themeSlice';


export default function ConfirmationModal(props) {
    const dispatch = useDispatch();

    // apply theme
    const themes = useSelector(state => state.theme)
    const [themeData, setThemeData] = useState({ "logoLink": "http", "primary": "#000000", "secondary": "#000000" });

    const { show, handleClose, handleConfirm, title, message, confirmLabel, unconfirmLabel, confirmVariant } = props;

    useEffect(() => {
        const fetchData = async () => {
            const result = await dispatch(fetchTheme());
            setThemeData(result.payload[0])
        };
        fetchData();
    }, [])

    return (
        <Modal show={show} onHide={handleClose} centered className='borderless-modal' style={{ fontFamily: "Nunito" }}>
            <Modal.Header closeButton style={{ borderBottom: 'none', backgroundColor: themeData.secondary }}>
                <strong>
                    {title}
                </strong>
            </Modal.Header>
            <Modal.Body className='text-center'>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 'none' }} className="d-flex justify-content-center">
                <Button variant="secondary" onClick={handleClose} className="bg-transparent text-dark">
                    {unconfirmLabel}
                </Button>
                <Button style={{ backgroundColor: themeData.primary, color: 'white', borderColor: 'transparent' }} variant={confirmVariant} onClick={handleConfirm}>
                    {confirmLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}