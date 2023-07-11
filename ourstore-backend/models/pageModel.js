import mongoose from 'mongoose';
import validator from 'validator';

const TEXT_TYPE = "text";
const PICTURE_TYPE = "picture";
const PICTUREOVERLAY_TYPE = "pictureoverlay";
const PRODUCT_TYPE = "product";


const columnFieldsValidator = function (fieldName, requiredColumnType) {
    return {
        validator: function() {
            for (const col of requiredColumnType){
                if (this.columnType === col) {
                    return true;
                }
            }
            return false;
        },
        message: `${fieldName} should be there for [${requiredColumnType}] column type`
    }
}

const pageSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A page must have a name']
    },
    isActive: {
        type: Boolean,
        required: [true, 'A page must have a isActive attribute']
    },
    isInHeader: {
        type: Boolean,
        required: [true, 'A page must have a isInHeader attribute']
    },
    sections: [
        {
            columns: [
                {
                    columnType: {
                        type: String,
                        required: [true, 'A column must have a column type'],
                        lowercase: true,
                        enum: {
                            values: [TEXT_TYPE, PICTURE_TYPE, PICTUREOVERLAY_TYPE, PRODUCT_TYPE],
                            message: 'Accepted columnType values are [text], [picture], [pictureoverlay], and [product]'
                        }
                    },
                    // TODO DEBUG: Image link HAVE TO EXIST when columnType is picture and pictureoverlay
                    imageLink: {
                        type: String,
                        validate: [
                            columnFieldsValidator('Image link', [PICTURE_TYPE, PICTUREOVERLAY_TYPE]),
                            {
                                validator: validator.isURL,
                                message: 'Image link "{VALUE}" should be a valid URL link'
                            }
                        ],

                    },
                    // TODO DEBUG: header HAVE TO EXIST when columnType is text
                    header: {
                        type: String,
                        validate: columnFieldsValidator('Header', [TEXT_TYPE])
                    },
                    content: {
                        type: String,
                        validate: columnFieldsValidator('Content', [TEXT_TYPE, PICTUREOVERLAY_TYPE])
                    },
                    // TODO DEBUG: productId HAVE TO EXIST when columnType is product
                    productId: {
                        type: String,
                        validate: columnFieldsValidator('Product ID', [PRODUCT_TYPE])
                    }
                }
            ]
        }
    ]
});

const Page = mongoose.model('Page', pageSchema);

export default Page;