import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/reducers/productSlice";

export default function InputProduct({ label, value, name, handleOnChange }) {

  const dispatch = useDispatch();
  const products = useSelector(state => state.products).products;

  useEffect(() => {
    dispatch(fetchProducts())
  }, [])

  return (
    <>
      <Form.Group className="m-3">
        <Form.Label>{label}</Form.Label>
        <Form.Select
          name={name}
          onChange={handleOnChange}
          defaultValue={value || ""}
        >
          {products.map((product) => (
            <option key={product._id} value={product._id} >
              {product.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </>
  )
}