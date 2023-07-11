import mongoose from 'mongoose';
import validator from 'validator';

const LIST = "list";
const GRID = "grid";

const themeSchema = mongoose.Schema({
    primary: {
        type: String,
        required: [true, 'A theme must have a primary color'],
        default: '#000000'
    },
    secondary: {
        type: String,
        required: [true, 'A theme must have a secondary color'],
        default: '#000000'
    },
    templateId: {
        type: String,
        required: [true, 'A theme must refer to a templateId correlated to the product page layout']
    }, /* reference to template collections */
    singleProductTemplateId: {
        type: String,
        required: [true, 'A theme must refer to a templateId correlated to the product page layout']
    }, /* reference to template collections */
    viewType: {
        type: String,
        required: [true, 'A theme must define a view type layout'],
        enum: {
            values: [LIST, GRID],
            message: 'Accepted viewType values are [list] or [grid]'
        }
    },
    columnSize: {
        type: Number,
        required: [true, 'A theme must define column size layout'],
        min: [3, 'The columnSize ({VALUE}) is lower than 3'],
        max: [6, 'The columnSize ({VALUE}) is higher than 6'],
    },
    logoLink: {
        type: String,
        validate: {
            validator: validator.isURL,
            message: 'Logo link "{VALUE}" should be a valid URL link'
        }
    }
});

const Theme = mongoose.model('Theme', themeSchema);

export default Theme;