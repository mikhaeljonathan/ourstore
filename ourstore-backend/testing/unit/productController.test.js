import { getAllProducts, addProduct, editProduct, deleteProduct } from '../../controllers/productController.js';
import productModel from '../../models/productModel.js';
import httpMocks from "node-mocks-http";
import getProductData from "../mock-data/productController/getProductData-Out.json";
import addProductDataIn from "../mock-data/productController/addProductData-In.json";
import addProductDataOut from "../mock-data/productController/addProductData-Out.json";
import editProductData from "../mock-data/productController/editProductData-find.json";
import editProductDataOut from "../mock-data/productController/editProductData-Out.json";

let req, res, next;
beforeEach(() => {
    jest.resetAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndDelete = jest.fn();

describe("ProductController.getAllProducts", () => {
    it("should have a getAllProducts function", () => {
        expect(typeof getAllProducts).toBe("function");
    });
    it("should call productModel.find", async () => {
        await getAllProducts(req, res, next);
        expect(productModel.find).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await getAllProducts(req, res, next);
        expect(res.statusCode).toBe(200);
    });
    it("should return json body in response", async () => {
        productModel.find.mockReturnValue(getProductData);
        await getAllProducts(req, res, next);
        expect(res._getJSONData().data).toStrictEqual(getProductData);
    });
})

describe("ProductController.addProduct", () => {
    const saveMock = jest.fn();

    beforeEach(() => {
        req.body = addProductDataIn;
        jest.spyOn(productModel.prototype, 'save').mockImplementation(saveMock);
        productModel.find.mockReturnValue([]);
    })

    it("should have an addProduct function", () => {
        expect(typeof addProduct).toBe("function");
    });
    it("should call productModel.save", async () => {
        await addProduct(req, res, next);
        expect(saveMock).toBeCalled();
    });
    it("should return 201 response code", async () => {
        await addProduct(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(res.statusCode).toBe(201);
    })
    it("should return json body in response", async () => {
        await addProduct(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        delete testData.data._id
        expect(testData).toStrictEqual(addProductDataOut);
    });
})

describe("ProductController.editProduct", () => {
    const saveMock = jest.fn();

    beforeEach(() => {
        req.body = editProductData;
        jest.spyOn(productModel.prototype, 'save').mockImplementation(saveMock);
        productModel.findById.mockReturnValue(editProductData);
    })

    it("should have an editProduct function", () => {
        expect(typeof editProduct).toBe("function");
    });
    it("should call productModel.findById", async () => {
        await editProduct(req, res, next);
        expect(productModel.findById).toBeCalled();
    });
    it("should call productModel.save", async () => {
        await editProduct(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(saveMock).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await editProduct(req, res, next);
        expect(res.statusCode).toBe(200);
    })
    it("should return json body in response", async () => {
        await editProduct(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        expect(testData).toStrictEqual(editProductDataOut);
    });
})

describe("ProductController.deleteProduct", () => {
    beforeEach(() => {
        productModel.findByIdAndDelete.mockReturnValue([]);
    })

    it("should have an deleteProduct function", () => {
        expect(typeof deleteProduct).toBe("function");
    });
    it("should call productModel.findByIdAndDelete", async () => {
        await deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toBeCalled();
    });
    it("should return 204 response code", async () => {
        await deleteProduct(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(res.statusCode).toBe(204);
    })
})