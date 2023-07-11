import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchProducts } from "../../redux/reducers/productSlice";

const ProductCardPage = ({ column }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const products = useSelector(state => state.products).products;
    const filtered = products.filter((product) => product._id === column.productId);

    useEffect(() => {
        dispatch(fetchProducts())
    }, []);

    const handleViewSingleProduct = (productId) => {
        navigate(`/viewproduct/${productId}`);
    }

    return (
        <div className="p-0 mt-2 mb-2 d-flex justify-content-center align-items-center">
            {filtered.length > 0 && filtered[0].images && (
                <Card className="border-0" onClick={() => handleViewSingleProduct(column.productId)} role="button" style={{ maxWidth: '16rem', minWidth: '10rem', margin: '1rem' }}>
                    <Card.Img className='card-img' variant="top" src={filtered[0].images[0].imageLink} alt={filtered[0].name} />
                    <Card.Body className="text-center">
                        <Card.Title className="text-truncate">{filtered[0].name}</Card.Title>
                        <Card.Text>
                            Rp {filtered[0].price}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )
            }
        </div>
    )
}

export default ProductCardPage;
