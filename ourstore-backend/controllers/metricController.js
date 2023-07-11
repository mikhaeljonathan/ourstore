import Metric from "../models/metricModel.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const getMetric = catchAsync(async (req, res, next) => {
    const metric = await Metric.find();

    res.status(200).json({
        status: 'success',
        data: metric
    });
});

export const addMetric = catchAsync(async (req, res, next) => {
    const searchedMetric = await Metric.find();
    if (searchedMetric.length > 0) {
        return next(new AppError('There is already a metric in the collection', 400));
    }

    const newMetric = new Metric(req.body);
    
    await newMetric.save();

    res.status(201).json({
        status: 'success',
        data: newMetric
    });
});

export const editMetric = catchAsync(async (req, res, next) => {
    const searchedMetric = await Metric.find();
    const metricId = searchedMetric[0]._id.toString();

    const editedMetric = await Metric.findByIdAndUpdate(metricId, req.body, {
        new: true,
        runValidators: true
    });

    if (!editedMetric) {
        return next(new AppError(`No metric found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: editedMetric
    });
});

// export const deleteMetric = async (req, res) => {
//     try {
//         await Metric.findByIdAndDelete(req.params.id);
//         res.status(204).send('success');
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }
