import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";

const GridContainerLayout = (props) => {
    console.log(props)

    const navigate = useNavigate();

    // declare props variable
    let viewType = props.viewType
    let columnSize = props.columnSize
    let productList = props.products.products
    let layoutType = props.layoutType

    const handleViewSingleProduct = (props) => {
        navigate(`/viewproduct/${props}`);
    }

    let output
    if (layoutType === '1') {
        output =
            <Row xs={2} md={columnSize} className="g-3 p-3" style={{ marginRight: '0' }}>
                {productList && Object.keys(productList).map((product) => (
                    <Col key={productList[product]._id}>
                        <Card className="border-0" onClick={() => handleViewSingleProduct(productList[product]._id)} role="button">
                            <Card.Img className='card-img' variant="top" src={productList[product].images[0].imageLink} alt={productList[product].name} />

                            <Card.Body className="text-center">
                                <Card.Title className="text-truncate">{productList[product].name}</Card.Title>
                                <Card.Text>
                                    Rp {productList[product].price.toLocaleString('id-ID')}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
    }
    else if (layoutType === '2') {
        output =
            <Row xs={3} md={columnSize} className="g-3 p-3" style={{ marginRight: '0' }}>
                {productList && Object.keys(productList).map((product) => (
                    <Col key={productList[product]._id}>
                        <Card className="customCard" onClick={() => handleViewSingleProduct(productList[product]._id)} role="button">
                            <Card.Img className='card-img' variant="top" src={productList[product].images[0].imageLink} alt={productList[product].name} />

                            <Card.Body>
                                <Card.Title className="text-truncate">{productList[product].name}</Card.Title>
                                <Card.Text className="text-secondary text-truncate">
                                    {productList[product].description}
                                </Card.Text>
                                <Card.Text>
                                    Rp {productList[product].price.toLocaleString('id-ID')}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
    }

    return (
        <Container fluid className={`ml-2 p-0 ${viewType === 'grid' ? '' : 'd-none'}`}>
            {output}
        </Container>

    )
}



export default GridContainerLayout;