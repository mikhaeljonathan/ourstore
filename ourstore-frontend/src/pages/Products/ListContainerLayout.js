import { Card, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import './Products.css';

const ListContainerLayout = (props) => {
    
    const navigate = useNavigate();

    let viewType = props.viewType
    let productList = props.products.products
    let layoutType = props.layoutType

    const handleViewSingleProduct = (props) => {
        navigate(`/viewproduct/${props}`);
    }

    let output 
    if (layoutType === '3') {
        output =
            <Row className="g-3 p-3">
                {productList && Object.keys(productList).map((product) => (
                    <Card key={productList[product]._id} className="d-flex flex-row customCard" onClick={() => handleViewSingleProduct(productList[product]._id)} role="button">

                        <Card.Img className="card-img-list card-img" src={productList[product].images[0].imageLink} alt={productList[product].name} ></Card.Img>
                        
                        <Card.Body className="d-flex justify-content-between">
                            <div className="col-md-10">
                                <Card.Title>{productList[product].name}</Card.Title>
                                <Card.Text className="text-secondary">
                                    {productList[product].description}
                                </Card.Text>
                            </div>
                            <div className="col-md-2">
                                <Card.Text className="fw-bold fs-5 text-end" >
                                    Rp {productList[product].price.toLocaleString('id-ID')}
                                </Card.Text>
                            </div>
                        </Card.Body>

                    </Card>
                ))}
            </Row>
    }

    else if (layoutType === '4') {
        output =
            <Row className="g-3 p-3">
                {productList && Object.keys(productList).map((product) => (
                    <Card key={productList[product]._id} className="d-flex flex-row" onClick={() => handleViewSingleProduct(productList[product]._id)} role="button">

                        <Card.Img className="card-img-list card-img" src={productList[product].images[0].imageLink} alt={productList[product].name} />

                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div>
                                <Card.Title>{productList[product].name}</Card.Title>
                                <Card.Text className="text-secondary">
                                    {productList[product].description}
                                </Card.Text>
                            </div>
                            <div className="fw-bold fs-5 mt-3">
                                <Card.Text>
                                    Rp {productList[product].price.toLocaleString('id-ID')}
                                </Card.Text>
                            </div>
                        </Card.Body>

                    </Card>
                ))}
            </Row>
    }

    return (
        <Container fluid className={`${viewType === 'list' ? '' : 'd-none'}`} >
            {output}
        </Container>
    )
}

export default ListContainerLayout;
