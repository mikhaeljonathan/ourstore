import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../../App";

export default function UploadPicture({ label, value, name, alt, handleOnChange }) {

  const jwt = Cookies.get('jwt');

  const [imgPreview, setImgPreview] = useState(null);
  const [image, setImage] = useState(null);

  const handleImageOnChange = async (event) => {
    const previewUrlImage = URL.createObjectURL(event.target.files[0]);
    setImage(event.target.files[0])
    setImgPreview(previewUrlImage);
    console.log(event.target)
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    try {
      await axios.post(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/pages/images`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }).then((res) => {
        let urlStorage = res.data.data
        handleOnChange({ target: { name, value: urlStorage } })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // const handleUploadImage = () => {
  //   const formData = new FormData();
  //   formData.append('image', image);

  //   axios.post(`http://${BE_HOSTNAME}:${BE_PORT}/api/v1/pages/images`, formData, {
  //     withCredentials: true,
  //     headers: {
  //       Authorization: `Bearer ${jwt}`
  //     }
  //   })
  //     .then((res) => {
  //       alert(res)
  //     })
  //     .catch((err) => {
  //       alert(err)
  //     })

  // }

  return (
    <>
      <Form.Group className="m-3">
        {label && <Form.Label>{label}</Form.Label>}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <Image
            style={{
              width: "250px",
              height: "250px",
            }}
            src={value || imgPreview || ''}
            alt={alt}
            fluid
          />
        </div>
        <Form.Control
          type="file"
          defaultValue={imgPreview || ''}
          name={name}
          onChange={handleImageOnChange}
          accept='image/*'
        />
      </Form.Group>
    </>
  );
}
