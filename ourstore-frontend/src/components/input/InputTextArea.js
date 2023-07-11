import Form from "react-bootstrap/Form";

export default function InputTextArea({ label, value, name, handleOnChange }) {
  return (
    <>
      <Form.Group className="m-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          as="textarea"
          type="text"
          defaultValue={value || ""}
          // placeholder="Your Text Here"
          name={name}
          style={{ height: '130px' }}
          onChange={handleOnChange}
        />
      </Form.Group>
    </>
  );
}
