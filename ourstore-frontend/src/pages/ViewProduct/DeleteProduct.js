import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { deleteSingleProduct } from "../../redux/reducers/singleproductSlice";
import ConfirmationDialog from "../../components/modal/ConfirmationDialog"

const DeleteProduct = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteSingleProduct(props.id));
        navigate("/products", {
            state: {
                isDeleted: true,
            }, replace: true
        });

        // setTimeout(window.location.reload.bind(window.location), 1000);
        // alert("Product Deleted, This Page will Navigate to Products List")
    }

    return (
        <ConfirmationDialog
            show={props.show}
            handleClose={props.onHide}
            handleConfirm={handleDelete}
            title="Delete Product"
            message="Are you sure you want to delete this product?"
            confirmLabel="Confirm"
            unconfirmLabel="Cancel"
            confirmVariant="primary"
        />
    )

}

export default DeleteProduct;