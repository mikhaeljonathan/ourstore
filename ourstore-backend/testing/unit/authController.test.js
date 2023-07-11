import { login, signup } from '../../controllers/authController.js';
import userModel from '../../models/userModel.js';
import httpMocks from "node-mocks-http";
import loginData from "../mock-data/authController/login.json";
import loginDataOut from "../mock-data/authController/loginOut.json";
// import addProductDataOut from "../mock-data/productController/addProductData-Out.json";
// import editProductData from "../mock-data/productController/editProductData-find.json";
// import editProductDataOut from "../mock-data/productController/editProductData-Out.json";

let req, res, next;
beforeEach(() => {
    jest.resetAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

userModel.findOne = jest.fn();

describe("AuthController.login", () => {
    beforeEach(() => {
        req.body = loginData;
        userModel.findOne.mockReturnValue(loginData);
    })

    it("should have a login function", () => {
        expect(typeof login).toBe("function");
    });
    // it("should call userModel.findOne", async () => {
    //     await login(req, res, next);
    //     expect(userModel.findOne).toBeCalled();
    // });
    // it("should return 200 response code", async () => {
    //     await login(req, res, next);
    //     expect(res.statusCode).toBe(201);
    // });
    // it("should return json body in response", async () => {
    //     await login(req, res, next);
    //     expect(res._getJSONData().data).toStrictEqual(loginDataOut);
    // });
})

