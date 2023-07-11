import React from "react";
import './PictureOverlay.css'

const TextSection = ({ column }) => {
    return (
        <div className="p-0 mt-2 mb-2 d-flex justify-content-center text-center align-items-center">
            <div>
                <h3 className="p-2">{column.header}</h3>
                <p className="pt-2 pb-2 pl-5 pr-5">{column.content}</p>
            </div>
        </div>
    )
}

export default TextSection;
