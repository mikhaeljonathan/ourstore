import React from "react";
import { Image } from "react-bootstrap";
import './PictureOverlay.css'

const ImageColumn = ({ column }) => {
    return (
        <div className="d-flex justify-content-center align-items-center mt-2 mb-2 p-0">
            <Image
                src={column.imageLink}
                // style={{ aspectRatio: '4/3', objectFit: 'cover', maxHeight: '40vh' }} 
                style={{ maxHeight: '40vh' }}
            />
        </div>
    )
}

export default ImageColumn;
