import mongoose from 'mongoose';

const metricSchema = mongoose.Schema({
    productSoldPerMonth: {
        type: Number,
        required: [true, 'Metrics must have a productSoldPerMonth value'],
        default: 0
    },
    revenuePerMonth: {
        type: Number,
        required: [true, 'Metrics must have a revenuePerMonth value'],
        default: 0
    },
    dailyActiveUser: {
        type: Number,
        required: [true, 'Metrics must have a dailyActiveUser value'],
        default: 0
    }
});

const Metric = mongoose.model('Metric', metricSchema);

export default Metric;