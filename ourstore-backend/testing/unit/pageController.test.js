import { getAllPages, deletePage, editPage, addPage } from '../../controllers/pageController.js';
import pageModel from '../../models/pageModel.js';
import httpMocks from "node-mocks-http";
import getAllPagesData from "../mock-data/pageController/getAllPagesData-Out.json";
import addPageDataIn from "../mock-data/pageController/addPageData-In.json";
import addPageDataOut from "../mock-data/pageController/addPageData-out.json";
import editPageData from "../mock-data/pageController/editPageData-find.json";
import editPageDataOut from "../mock-data/pageController/editPageData-Out.json";

let req, res, next;
beforeEach(() => {
    jest.resetAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

pageModel.find = jest.fn();
pageModel.findById = jest.fn();
pageModel.findByIdAndDelete = jest.fn();

describe("PageController.getAllPages", () => {
    it("should have a getAllPages function", () => {
        expect(typeof getAllPages).toBe("function");
    });
    it("should call pageModel.find", async () => {
        await getAllPages(req, res, next);
        expect(pageModel.find).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await getAllPages(req, res, next);
        expect(res.statusCode).toBe(200);
    });
    it("should return json body in response", async () => {
        pageModel.find.mockReturnValue(getAllPagesData);
        await getAllPages(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(res._getJSONData().data).toStrictEqual(getAllPagesData);
    });
})

describe("PageController.addPage", () => {
    const saveMock = jest.fn();

    beforeEach(() => {
        req.body = addPageDataIn;
        jest.spyOn(pageModel.prototype, 'save').mockImplementation(saveMock);
        pageModel.find.mockReturnValue([]);
    })

    it("should have an addPage function", () => {
        expect(typeof addPage).toBe("function");
    });
    it("should call pageModel.save", async () => {
        await addPage(req, res, next);
        expect(saveMock).toBeCalled();
    });
    it("should return 201 response code", async () => {
        await addPage(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(res.statusCode).toBe(201);
    })
    it("should return json body in response", async () => {
        await addPage(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        delete testData.data._id
        expect(testData).toStrictEqual(addPageDataOut);
    });
})

describe("PageController.editPage", () => {
    const saveMock = jest.fn();

    beforeEach(() => {
        req.body = editPageData;
        jest.spyOn(pageModel.prototype, 'save').mockImplementation(saveMock);
        pageModel.findById.mockReturnValue(editPageData);
    })

    it("should have an editPage function", () => {
        expect(typeof editPage).toBe("function");
    });
    it("should call pageModel.findById", async () => {
        await editPage(req, res, next);
        expect(pageModel.findById).toBeCalled();
    });
    it("should call pageModel.save", async () => {
        await editPage(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(saveMock).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await editPage(req, res, next);
        expect(res.statusCode).toBe(200);
    })
    it("should return json body in response", async () => {
        await editPage(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        expect(testData).toStrictEqual(editPageDataOut);
    });
})

describe("PageController.deletePage", () => {
    beforeEach(() => {
        pageModel.findByIdAndDelete.mockReturnValue([]);
    })

    it("should have an deletePage function", () => {
        expect(typeof deletePage).toBe("function");
    });
    it("should call pageModel.findByIdAndDelete", async () => {
        await deletePage(req, res, next);
        expect(pageModel.findByIdAndDelete).toBeCalled();
    });
    it("should return 204 response code", async () => {
        await deletePage(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(res.statusCode).toBe(204);
    })
})
