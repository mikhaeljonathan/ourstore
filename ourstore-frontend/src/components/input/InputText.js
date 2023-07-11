import Form from "react-bootstrap/Form";

export default function InputText({ label, value, name, handleOnChange }) {
  return (
    <>
      <Form.Group className="m-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="text"
          defaultValue={value || ""}
          name={name}
          onChange={handleOnChange}
        />
      </Form.Group>
    </>
  )
}