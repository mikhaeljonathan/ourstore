import { useState, useEffect, useRef } from 'react';
import { Button, Card, Col, Image, Row } from 'react-bootstrap';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditProductPic = (props) => {
    const productImage = props.listproducts.images
    const themeData = props.themeData
    const [previewImages, setPreviewImages] = useState(productImage);
    const [images, setImages] = useState(productImage);

    useEffect(() => {
        props.handleFileChange([...images]);
    }, [previewImages])

    const handleFileInput = (event) => {
        const files = event.target.files;
        const previewUrls = [];

        for (let i = 0; i < files.length; i++) {
            const previewUrlImage = URL.createObjectURL(files[i]);
            const previewName = files[i].name;
            const previewUrlObject = { img: previewUrlImage, name: previewName };

            previewUrls.push(previewUrlObject);
        }

        setPreviewImages(previewUrls);
        setImages(event.target.files)
    }

    const handleClear = (selectedImage) => {
        URL.revokeObjectURL(selectedImage);
        setPreviewImages((prevImages) => prevImages.filter((img) => {
            return img !== selectedImage;
        }));
        setImages(([...images]) => images.filter((img) => {
            return img._id !== selectedImage._id || img.name !== selectedImage.name
        }));

    };

    const hiddenFileInput = useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    return (
        <div>
            <Button variant="light" style={{ '--bs-btn-border-color': themeData.secondary, backgroundColor: themeData.secondary, color: 'white' }} onClick={handleClick}>
                Change Image
            </Button>
            <input type="file"
                ref={hiddenFileInput}
                onChange={handleFileInput}
                style={{ display: 'none' }}
                multiple
                accept='image/*' />
            <br /><br />
            <Row className='p-0 g-3' xs={2} md={2} lg={4}>
                {previewImages && Object.keys(previewImages).map((key, index) => {
                    return (
                        <Col key={index}>
                            <Card style={{ width: '100%', height: '100%', position: 'relative' }}>
                                <Image
                                    src={previewImages[key].imageLink || previewImages[key].img}
                                    alt="Square image"
                                    rounded
                                    id="img-preview"
                                />
                                {previewImages[key].img &&
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleClear(previewImages[key])}
                                    >
                                        <FontAwesomeIcon icon={faCircleXmark} style={{ color: "#111111" }} />
                                    </div>
                                }
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    );
};


export default EditProductPic;
