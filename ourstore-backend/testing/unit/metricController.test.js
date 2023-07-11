import { getMetric, editMetric, addMetric } from '../../controllers/metricController.js';
import metricModel from '../../models/metricModel.js';
import httpMocks from "node-mocks-http";
import getMetricData from "../mock-data/metricController/getMetricData-Out.json";
import addMetricDataIn from "../mock-data/metricController/addMetricData-In.json";
import addMetricDataOut from "../mock-data/metricController/addMetricData-Out.json";
import editMetricData from "../mock-data/metricController/editMetricData-find.json";
import editMetricDataOut from "../mock-data/metricController/editMetricData-Out.json";

let req, res, next;
beforeEach(() => {
    jest.resetAllMocks();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

metricModel.find = jest.fn();
metricModel.findById = jest.fn();
metricModel.findByIdAndUpdate = jest.fn();

describe("MetricController.getMetric", () => {
    it("should have a getMetric function", () => {
        expect(typeof getMetric).toBe("function");
    });
    it("should call metricModel.find", async () => {
        await getMetric(req, res, next);
        expect(metricModel.find).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await getMetric(req, res, next);
        expect(res.statusCode).toBe(200);
    });
    it("should return json body in response", async () => {
        metricModel.find.mockReturnValue(getMetricData);
        await getMetric(req, res, next);
        expect(res._getJSONData().data).toStrictEqual(getMetricData);
    });
})

describe("MetricController.addMetric", () => {
    const saveMock = jest.fn();

    beforeEach(() => {
        req.body = addMetricDataIn;
        jest.spyOn(metricModel.prototype, 'save').mockImplementation(saveMock);
        metricModel.find.mockReturnValue([]);
    })

    it("should have an addMetric function", () => {
        expect(typeof addMetric).toBe("function");
    });
    it("should call metricModel.save", async () => {
        await addMetric(req, res, next);
        expect(saveMock).toBeCalled();
    });
    it("should return 201 response code", async () => {
        await addMetric(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(res.statusCode).toBe(201);
    })
    it("should return json body in response", async () => {
        await addMetric(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        delete testData.data._id
        expect(testData).toStrictEqual(addMetricDataOut);
    });
})

describe("MetricController.editMetric", () => {
    const saveMock = jest.fn();

    beforeEach(() => {
        req.body = editMetricData;
        metricModel.find.mockReturnValue(editMetricData);
        metricModel.findByIdAndUpdate.mockReturnValue(editMetricData[0]);
    })

    it("should have an editMetric function", () => {
        expect(typeof editMetric).toBe("function");
    });
    it("should call metricModel.find", async () => {
        await editMetric(req, res, next);
        expect(metricModel.find).toBeCalled();
    });
    it("should call metricModel.findByIdAndUpdate", async () => {
        await editMetric(req, res, next);
        expect(metricModel.findByIdAndUpdate).toBeCalled();
    });
    it("should return 200 response code", async () => {
        await editMetric(req, res, next);
        expect(res.statusCode).toBe(200);
    })
    it("should return json body in response", async () => {
        await editMetric(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 10));
        const testData = res._getJSONData();
        delete testData.data._id
        expect(testData).toStrictEqual(editMetricDataOut);
    });
})