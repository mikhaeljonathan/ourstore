import React from "react";
import './PictureOverlay.css'

const PictureOverlay = ({ column }) => {
    return (
        <div className="background"
            style={{ backgroundImage: "url(" + column.imageLink + ")" }}>
            <div className="text-overlay">
                <h5>{column.content}</h5>
            </div>
        </div>
    )
}

export default PictureOverlay;
