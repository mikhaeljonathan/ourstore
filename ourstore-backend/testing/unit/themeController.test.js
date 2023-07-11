import { getTheme, editTheme, addTheme } from '../../controllers/themeController.js';
import themeModel from '../../models/themeModel.js';
import httpMocks from "node-mocks-http";
import getThemeData from "../mock-data/themeController/getThemeData-Out.json";
import addThemeDataIn from "../mock-data/themeController/addThemeData-In.json";
import addThemeDataOut from "../mock-data/themeController/addThemeData-out.json";
import editThemeData from "../mock-data/themeController/editThemeData-find.json";
import editThemeDataOut from "../mock-data/themeController/editThemeData-Out.json";

let req, res, next;
beforeEach(() => {
    jest.resetAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

themeModel.find = jest.fn();
themeModel.findById = jest.fn();

describe("ThemeController.getTheme", () => {
    it("should have a getTheme function", () => {
        expect(typeof getTheme).toBe("function");
    });
    it("should call themeModel.find", async () => {
        await getTheme(req, res, next);
        expect(themeModel.find).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await getTheme(req, res, next);
        expect(res.statusCode).toBe(200);
    });
    it("should return json body in response", async () => {
        themeModel.find.mockReturnValue(getThemeData);
        await getTheme(req, res, next);
        expect(res._getJSONData().data).toStrictEqual(getThemeData);
    });
})

describe("ThemeController.addTheme", () => {
    const saveMock = jest.fn();

    beforeEach(() => {
        req.body = addThemeDataIn;
        jest.spyOn(themeModel.prototype, 'save').mockImplementation(saveMock);
        themeModel.find.mockReturnValue([]);
    })

    it("should have an addTheme function", () => {
        expect(typeof addTheme).toBe("function");
    });
    it("should call themeModel.save", async () => {
        await addTheme(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(saveMock).toBeCalled();
    });
    it("should return 201 response code", async () => {
        await addTheme(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(res.statusCode).toBe(201);
    })
    it("should return json body in response", async () => {
        await addTheme(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        delete testData.data._id
        expect(testData).toStrictEqual(addThemeDataOut);
    });
})

describe("ThemeController.editTheme", () => {
    const saveMock = jest.fn();

    beforeEach(() => {
        req.body = editThemeData;
        jest.spyOn(themeModel.prototype, 'save').mockImplementation(saveMock);
        themeModel.find.mockReturnValue(editThemeData);
        themeModel.findById.mockReturnValue(editThemeData[0]);
    })

    it("should have an editTheme function", () => {
        expect(typeof editTheme).toBe("function");
    });
    it("should call themeModel.save", async () => {
        await editTheme(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(saveMock).toBeCalled();
    });
    it("should call themeModel.find", async () => {
        await editTheme(req, res, next);
        expect(themeModel.find).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await editTheme(req, res, next);
        expect(res.statusCode).toBe(200);
    })
    it("should return json body in response", async () => {
        await editTheme(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        delete testData.data._id
        expect(testData).toStrictEqual(editThemeDataOut);
    });
})