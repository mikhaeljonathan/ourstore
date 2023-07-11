import { getUser, editUser } from '../../controllers/userController.js';
import userModel from '../../models/userModel.js';
import httpMocks from "node-mocks-http";
import userid from "../mock-data/userController/iduser.txt";
import getUserData from "../mock-data/userController/getUserData-Out.json";
import editUserData from "../mock-data/userController/editUserData-find.json";
import editUserDataOut from "../mock-data/userController/editUserData-Out.json";

let req, res, next;
beforeEach(() => {
    jest.resetAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

userModel.find = jest.fn();
userModel.findById = jest.fn();
userModel.findByIdAndUpdate = jest.fn();

describe("UserController.getUser", () => {
    it("should have a getUser function", () => {
        expect(typeof getUser).toBe("function");
    });
    it("should call userModel.findById", async () => {
        userModel.findById.mockReturnValue(userid);
        await getUser(req, res, next);
        expect(userModel.findById).toBeCalled();
    });
    it("should return 200 response code", async () => {
        userModel.findById.mockReturnValue(userid);
        await getUser(req, res, next);
        expect(res.statusCode).toBe(200);
    });
    it("should return json body in response", async () => {
        userModel.findById.mockReturnValue(getUserData);
        await getUser(req, res, next);
        expect(res._getJSONData().data).toStrictEqual(getUserData);
    });
})


describe("UserController.editUser", () => {
    beforeEach(() => {
        req.body = editUserData;
        userModel.findByIdAndUpdate.mockReturnValue(editUserData);
    })

    it("should have an editUser function", () => {
        expect(typeof editUser).toBe("function");
    });
    it("should call userModel.findByIdAndUpdate", async () => {
        await editUser(req, res, next);
        expect(userModel.findByIdAndUpdate).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await editUser(req, res, next);
        expect(res.statusCode).toBe(200);
    })
    it("should return json body in response", async () => {
        await editUser(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        expect(testData).toStrictEqual(editUserDataOut);
    });
})